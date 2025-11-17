import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/auth/login-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminSession } from "@/lib/auth/admin";

export const metadata = {
  title: "Đăng nhập Admin",
  description:
    "Trang đăng nhập bảo vệ bằng Supabase Auth, chỉ dành cho bạn.",
};

export default async function AdminLoginPage() {
  const existingSession = await getAdminSession();

  if (existingSession) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center gap-10 px-6 py-16 lg:flex-row lg:items-center">
      <div className="space-y-4 text-center lg:text-left">
        <Badge variant="secondary" className="w-fit">
          Bạn là admin duy nhất
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Đăng nhập để quản lý gallery riêng tư.
        </h1>
        <p className="text-base text-muted-foreground">
          Supabase Auth chỉ cho phép email đã được whitelist. Sau khi đăng nhập,
          bạn có thể tạo key cho từng friend, upload ảnh và xem logs.
        </p>
      </div>
      <Card className="w-full max-w-md border-border/70 shadow-lg">
        <CardHeader>
          <CardTitle>Supabase Admin</CardTitle>
          <CardDescription>
            Sử dụng email/password đã tạo trong Supabase Auth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

