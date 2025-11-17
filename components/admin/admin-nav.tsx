"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Users, Images, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/admin/auth/sign-out-button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: ShieldCheck },
  { href: "/admin/friends", label: "Friends", icon: Users },
  { href: "/admin/friends/new", label: "Thêm friend", icon: Images },
  { href: "/admin/logs", label: "Logs", icon: Activity },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            ntan gallery
          </p>
          <p className="text-sm text-muted-foreground">
            Private admin · Supabase Auth protected
          </p>
        </div>
        <nav className="flex items-center gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
          <SignOutButton>
            <Button size="sm" variant="outline">
              Đăng xuất
            </Button>
          </SignOutButton>
        </nav>
      </div>
    </header>
  );
}

