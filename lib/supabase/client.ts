"use client";

import { createBrowserClient } from "@supabase/ssr";

import { browserEnv } from "@/lib/env/browser";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    browserEnv.NEXT_PUBLIC_SUPABASE_URL,
    browserEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

