import { notFound } from "next/navigation";

import { FriendAccessForm } from "@/components/friend/friend-access-form";
import { FriendGalleryGrid } from "@/components/friend/gallery-grid";
import { FriendLetter } from "@/components/friend/friend-letter";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFriendSessionFromCookies } from "@/lib/auth/friend";
import { getFriendBySlug } from "@/lib/data/friends";

type FriendPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: FriendPageProps) {
  const friend = await getFriendBySlug(params.slug);

  if (!friend) {
    return {
      title: "Không tìm thấy thư",
    };
  }

  return {
    title: friend.name,
    description:
      friend.description ??
      `Thư và gallery riêng tư dành cho ${friend.nickname ?? friend.name}`,
  };
}

export default async function FriendPage({ params }: FriendPageProps) {
  const friend = await getFriendBySlug(params.slug);

  if (!friend || !friend.is_published) {
    notFound();
  }

  const session = await getFriendSessionFromCookies(friend.slug);
  const unlocked = session?.friendId === friend.id;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="space-y-3">
        <Badge variant="outline" className="w-fit">
          {friend.nickname ?? friend.name}
        </Badge>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {friend.name}
          </h1>
          {friend.description && (
            <p className="mt-3 text-lg text-muted-foreground">
              {friend.description}
            </p>
          )}
        </div>
      </header>

      {!unlocked ? (
        <Card>
          <CardHeader>
            <CardTitle>Thư này đang được bảo vệ</CardTitle>
            <CardDescription>
              Chỉ những ai được chia sẻ key mới có thể mở khóa nội dung và gallery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FriendAccessForm
              slug={friend.slug}
              friendName={friend.nickname ?? friend.name}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Letter</CardTitle>
              <CardDescription>
                Nội dung markdown hiển thị an toàn với sanitize.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FriendLetter content={friend.letter_content} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>
                {friend.gallery_photos.length
                  ? "Ảnh riêng tư đã được upload lên Supabase Storage."
                  : "Chưa có ảnh nào, bạn có thể thêm từ admin panel."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FriendGalleryGrid photos={friend.gallery_photos} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

