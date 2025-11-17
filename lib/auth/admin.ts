import "server-only";

import { redirect } from "next/navigation";
import type { Session } from "@supabase/supabase-js";

import { serverEnv } from "@/lib/env/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = serverEnv.ADMIN_ALLOWED_EMAIL;

export async function getAdminSession(): Promise<Session | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const email = session.user.email?.toLowerCase();

  if (email !== ADMIN_EMAIL) {
    return null;
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

