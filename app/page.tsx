import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  ImageDown,
  Lock,
  ShieldCheck,
  UploadCloud,
  Users,
} from "lucide-react";

const highlights = [
  {
    icon: Lock,
    title: "Key riêng cho từng người",
    description:
      "Mỗi hồ sơ có access key riêng, xác thực qua Supabase + JWT HttpOnly để tránh lộ dữ liệu.",
  },
  {
    icon: UploadCloud,
    title: "Upload drag & drop",
    description:
      "Kéo thả nhiều ảnh, preview tức thì, tự động nén trước khi đẩy lên Supabase Storage private.",
  },
  {
    icon: ShieldCheck,
    title: "Theo dõi & rate limit",
    description:
      "Log mọi lượt mở thư, giới hạn 5 lần/10 phút theo IP nhằm bảo vệ key của bạn.",
  },
];

const adminActions = [
  "Quản lý friend + thư bằng markdown",
  "Sắp xếp thứ tự bằng drag & drop",
  "Theo dõi logs truy cập realtime",
];

export default function Home() {
  return (
    <main className="container mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
      <section className="rounded-3xl border bg-card/60 p-10 shadow-sm backdrop-blur">
        <Badge variant="outline" className="mb-4 w-fit gap-2">
          <ShieldCheck className="size-4" />
          Private Gallery in progress
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Kho ảnh & thư riêng tư cho bạn bè thân nhất.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:max-w-2xl">
          Website này được thiết kế để bạn là người duy nhất quản trị. Bạn tạo
          key, chia sẻ với từng người, còn hệ thống đảm bảo mọi hình ảnh và
          letter được mã hóa, ghi log và dễ dàng quản lý.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/admin">
              Mở admin preview
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/friend/demo-friend">Xem flow người nhận</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Icon className="size-5" />
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <ImageDown className="size-6 text-primary" />
              Upload pipeline
            </CardTitle>
            <CardDescription>
              Lưu file trong bucket private, theo dõi metadata qua bảng
              <code className="mx-1 rounded bg-muted px-1 py-0.5">
                uploads
              </code>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Kéo ảnh vào dropzone → preview client",
              "Nén bằng browser-image-compression nếu >2MB",
              "Server action ký URL Supabase → upload",
              "Ghi nhận metadata & cập nhật friend.gallery_photos",
            ].map((step) => (
              <div key={step} className="flex gap-3 text-sm">
                <Badge variant="outline" className="mt-0.5 size-6 justify-center">
                  ✓
                </Badge>
                <p className="text-muted-foreground">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Users className="size-6 text-primary" />
              Admin duy nhất
            </CardTitle>
            <CardDescription>
              Supabase Auth chỉ whitelist email của bạn, tất cả thao tác CRUD
              chạy server actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {adminActions.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border px-4 py-3"
              >
                <p className="text-base font-medium">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="rounded-3xl border bg-muted/40 px-8 py-10">
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Deployment checklist
          </p>
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "Vercel env + Supabase keys",
              "RLS policies cho friends, logs, uploads",
              "Cron cleanup rate_limits",
              "Backup DB & storage hàng tuần",
              "Sentry + Vercel Analytics",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Lock className="size-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
