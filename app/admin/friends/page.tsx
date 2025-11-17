import Link from "next/link";

import { FriendTable } from "@/components/admin/friends/friend-table";
import { Button } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/auth/admin";
import { getDashboardStats } from "@/lib/data/dashboard";

export default async function AdminFriendsPage() {
  await requireAdminSession();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Quản lý friends
          </h1>
          <p className="text-muted-foreground">
            Kéo để sắp xếp thứ tự hiển thị và chỉnh sửa nội dung từng friend.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/friends/new">Thêm friend</Link>
        </Button>
      </div>
      <FriendTable friends={stats.friends} />
    </div>
  );
}

