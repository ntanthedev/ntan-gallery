"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { saveFriendAction } from "@/app/admin/friends/actions";
import { friendFormSchema, type FriendFormValues } from "@/app/admin/friends/schema";
import { GalleryListEditor } from "@/components/admin/friends/gallery-list";
import { UploadDropzone } from "@/components/admin/friends/upload-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Props = {
  defaultValues?: FriendFormValues;
  friendId?: string;
  slug?: string;
  maxUploadSizeMB: number;
};

export function FriendForm({
  defaultValues,
  friendId,
  slug,
  maxUploadSizeMB,
}: Props) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FriendFormValues>({
    resolver: zodResolver(friendFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      slug: "",
      nickname: "",
      description: "",
      letterContent: "",
      mainPhoto: "",
      galleryPhotos: [],
      theme: {
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
      },
      accessKey: "",
      isPublished: true,
    },
  });

  async function onSubmit(values: FriendFormValues) {
    setIsSubmitting(true);
    try {
      await saveFriendAction({ ...values, id: friendId });
      toast({
        title: "Đã lưu friend",
        description: "Thông tin đã được cập nhật thành công.",
      });
    } catch (error) {
      toast({
        title: "Lỗi khi lưu",
        description:
          error instanceof Error
            ? error.message
            : "Không thể lưu friend, thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleUploaded(paths: string[]) {
    const current = form.getValues("galleryPhotos");
    form.setValue("galleryPhotos", [...current, ...paths], {
      shouldDirty: true,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đầy đủ</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ví dụ: Nguyễn Văn A" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="vi-du-ban-than" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tên thân mật" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh chính (đường dẫn)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="friends/123/main.jpg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Mô tả ngắn</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} placeholder="Giới thiệu..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border px-4 py-3">
                  <div className="space-y-0.5">
                    <FormLabel>Hiển thị</FormLabel>
                    <FormDescription>
                      Nếu tắt, friend sẽ không xuất hiện khi truy cập slug.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accessKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access key</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={
                        friendId
                          ? "Nhập nếu muốn thay đổi key hiện tại"
                          : "Key bắt buộc cho friend mới"
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Với friend mới, key là bắt buộc. Khi chỉnh sửa bạn có thể bỏ
                    trống để giữ nguyên key cũ.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="theme.primary"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <Label className="text-xs text-muted-foreground">
                        Primary
                      </Label>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme.secondary"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <Label className="text-xs text-muted-foreground">
                        Secondary
                      </Label>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Letter (Markdown)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="letterContent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={10}
                      placeholder="Viết thư bằng markdown..."
                    />
                  </FormControl>
                  <FormDescription>
                    Hỗ trợ Markdown + GFM, nội dung sẽ được sanitize khi render.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadDropzone
              friendId={friendId}
              slug={slug}
              maxSizeMB={maxUploadSizeMB}
              onUploaded={handleUploaded}
            />
            <GalleryListEditor
              photos={form.watch("galleryPhotos")}
              onChange={(next) =>
                form.setValue("galleryPhotos", next, { shouldDirty: true })
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                form.setValue(
                  "galleryPhotos",
                  [...form.getValues("galleryPhotos"), ""],
                  { shouldDirty: true },
                )
              }
            >
              Thêm đường dẫn trống
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="ghost" asChild>
            <Link href="/admin/friends">Hủy</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Lưu friend
          </Button>
        </div>
      </form>
    </Form>
  );
}

