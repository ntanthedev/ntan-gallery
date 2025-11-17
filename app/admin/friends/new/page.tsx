import { serverEnv } from "@/lib/env/server";
import { requireAdminSession } from "@/lib/auth/admin";
import { FriendForm } from "@/components/admin/friends/friend-form";

export default async function NewFriendPage() {
  await requireAdminSession();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Thêm friend mới</h1>
        <p className="text-muted-foreground">
          Tạo hồ sơ mới, nhập letter và upload gallery trong cùng một nơi.
        </p>
      </div>
      <FriendForm maxUploadSizeMB={serverEnv.UPLOAD_MAX_SIZE_MB} />
    </div>
  );
}

