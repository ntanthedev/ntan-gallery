import "server-only";

import { supabaseServiceRole } from "@/lib/supabase/service";
import type { Database } from "@/types/database";

export type FriendRecord = Database["public"]["Tables"]["friends"]["Row"];

export async function getFriendBySlug(slug: string) {
  const { data, error } = await supabaseServiceRole
    .from("friends")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as FriendRecord | null;
}

export async function getFriendById(id: string) {
  const { data, error } = await supabaseServiceRole
    .from("friends")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as FriendRecord | null;
}

export async function listFriends() {
  const { data, error } = await supabaseServiceRole
    .from("friends")
    .select("*")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as FriendRecord[];
}

