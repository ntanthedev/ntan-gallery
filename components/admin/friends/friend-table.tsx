"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  type DragEndEvent,
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, MoreHorizontal } from "lucide-react";

import { deleteFriendAction, reorderFriendsAction, togglePublishAction } from "@/app/admin/friends/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type FriendWithViews = {
  id: string;
  name: string;
  slug: string;
  nickname: string | null;
  is_published: boolean;
  order_index: number;
  gallery_photos: string[];
  views: number;
};

type Props = {
  friends: FriendWithViews[];
};

export function FriendTable({ friends }: Props) {
  const [items, setItems] = useState(friends);
  const [, startReorderTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(current, oldIndex, newIndex);
      startReorderTransition(async () => {
        await reorderFriendsAction(reordered.map((item) => item.id));
      });
      return reordered;
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-right">Views (7d)</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((friend) => (
                <SortableFriendRow key={friend.id} friend={friend} />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableFriendRow({
  friend,
}: {
  friend: FriendWithViews;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: friend.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isDeleting, setDeleting] = useState(false);

  function handleTogglePublish(nextValue: boolean) {
    startTransition(async () => {
      await togglePublishAction({ friendId: friend.id, isPublished: nextValue });
      toast({
        title: "Đã cập nhật trạng thái",
        description: `${friend.name} hiện ${
          nextValue ? "hiển thị" : "đang ẩn"
        }.`,
      });
    });
  }

  async function handleDelete() {
    const confirmed = confirm(
      `Xóa friend "${friend.name}" và toàn bộ dữ liệu liên quan?`,
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteFriendAction(friend.id);
      toast({
        title: "Đã xóa friend",
        description: `${friend.name} không còn trong danh sách.`,
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "opacity-60")}
    >
      <TableCell className="w-[40px]">
        <button
          className="text-muted-foreground hover:text-foreground"
          aria-label="Kéo để sắp xếp"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{friend.name}</span>
          {friend.nickname && (
            <span className="text-xs text-muted-foreground">
              {friend.nickname}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>{friend.slug}</TableCell>
      <TableCell className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Switch
            checked={friend.is_published}
            onCheckedChange={(checked) => handleTogglePublish(checked)}
            disabled={isPending}
          />
          {friend.is_published ? "Hiển thị" : "Đang ẩn"}
        </div>
      </TableCell>
      <TableCell className="text-right font-mono">{friend.views}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/friends/${friend.id}`}>Chỉnh sửa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              {isDeleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

