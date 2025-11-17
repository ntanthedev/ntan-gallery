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
import { getRecentLogs } from "@/lib/data/logs";

export default async function AdminLogsPage() {
  await requireAdminSession();
  const logs = await getRecentLogs(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Access logs</h1>
        <p className="text-muted-foreground">
          Theo dõi lượt nhập key gần nhất và phát hiện brute-force.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>50 lượt gần nhất</CardTitle>
          <CardDescription>
            Dùng filter của Supabase hoặc mở rộng trang này nếu cần thêm.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Friend</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>User agent</TableHead>
                <TableHead className="text-right">Thời gian</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={`${log.id}-${log.accessed_at}`}>
                  <TableCell className="font-medium">
                    {log.friendName}
                    <p className="text-xs text-muted-foreground">
                      {log.friendSlug}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">{log.ip_address}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                    {log.user_agent}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {new Date(log.accessed_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={log.success ? "secondary" : "destructive"}
                      className="justify-end"
                    >
                      {log.success ? "Success" : "Failed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

