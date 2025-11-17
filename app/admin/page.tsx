import {
  Activity,
  BookOpen,
  Lock,
  Users as UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdminSession } from "@/lib/auth/admin";
import { getDashboardStats } from "@/lib/data/dashboard";

const metrics = [
  { label: "Friends", icon: UsersIcon },
  { label: "Published", icon: BookOpen },
  { label: "Views (7d)", icon: Activity },
];

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const stats = await getDashboardStats();

  const friendLookup = new Map(stats.friends.map((f) => [f.id, f]));
  const latestLogs = stats.latestLogs.map((log) => ({
    ...log,
    friendName: friendLookup.get(log.friend_id)?.name ?? "Unknown",
  }));

  const metricValues = [
    stats.totalFriends,
    stats.publishedFriends,
    stats.totalViews,
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Badge variant="outline" className="w-fit">
          Xin chào {session.user.email}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Tổng quan gallery riêng tư
        </h1>
        <p className="text-muted-foreground">
          Giám sát lượt truy cập, trạng thái friends và hoạt động gần nhất.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {metricValues[index]}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Friends nổi bật</CardTitle>
            <CardDescription>
              Thống kê lượt mở thư trong 7 ngày qua.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.friends.slice(0, 5).map((friend) => (
                  <TableRow key={friend.id}>
                    <TableCell className="font-medium">
                      {friend.name}
                    </TableCell>
                    <TableCell>{friend.slug}</TableCell>
                    <TableCell className="text-right">
                      {friend.views}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lượt truy cập gần nhất</CardTitle>
            <CardDescription>
              Ghi nhận cả thành công và thất bại để dễ phát hiện brute-force.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestLogs.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Chưa có log nào trong 7 ngày qua.
              </p>
            )}
            {latestLogs.map((log) => (
              <div
                key={log.accessed_at + log.friend_id}
                className="flex items-center justify-between rounded-xl border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{log.friendName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.accessed_at).toLocaleString()}
                  </p>
                </div>
                <Badge
                  variant={log.success ? "secondary" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {log.success ? "Success" : "Failed"}
                  {!log.success && <Lock className="size-3" />}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
