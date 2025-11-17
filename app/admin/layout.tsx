import type { ReactNode } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
      <Toaster />
    </div>
  );
}

