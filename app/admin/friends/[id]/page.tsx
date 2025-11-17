import { notFound } from "next/navigation";

import { FriendForm } from "@/components/admin/friends/friend-form";
import { requireAdminSession } from "@/lib/auth/admin";
import { getFriendById } from "@/lib/data/friends";
import { serverEnv } from "@/lib/env/server";

type PageProps = {
  params: { id: string };
};

export default async function EditFriendPage({ params }: PageProps) {
  await requireAdminSession();
  const friend = await getFriendById(params.id);

  if (!friend) {
    notFound();
  }

  const themeConfig =
    (friend.theme_config as Record<string, string> | null) ?? {};

  const defaultValues = {
    id: friend.id,
    name: friend.name,
    slug: friend.slug,
    nickname: friend.nickname ?? "",
    description: friend.description ?? "",
    letterContent: friend.letter_content ?? "",
    mainPhoto: friend.main_photo ?? "",
    galleryPhotos: friend.gallery_photos ?? [],
    theme: {
      primary: themeConfig.primary ?? "#FF6B6B",
      secondary: themeConfig.secondary ?? "#4ECDC4",
    },
    accessKey: "",
    isPublished: friend.is_published,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Chỉnh sửa {friend.name}</h1>
        <p className="text-muted-foreground">
          Cập nhật nội dung thư, gallery và theme cá nhân.
        </p>
      </div>
      <FriendForm
        defaultValues={defaultValues}
        friendId={friend.id}
        slug={friend.slug}
        maxUploadSizeMB={serverEnv.UPLOAD_MAX_SIZE_MB}
      />
    </div>
  );
}

