import "server-only";

import { supabaseServiceRole } from "@/lib/supabase/service";

export async function getRecentLogs(limit = 50) {
  const [logsRes, friendsRes] = await Promise.all([
    supabaseServiceRole
      .from("access_logs")
      .select("*")
      .order("accessed_at", { ascending: false })
      .limit(limit),
    supabaseServiceRole.from("friends").select("id, name, slug"),
  ]);

  if (logsRes.error) {
    throw new Error(logsRes.error.message);
  }

  if (friendsRes.error) {
    throw new Error(friendsRes.error.message);
  }

  const friendLookup = new Map(
    friendsRes.data.map((friend) => [friend.id, friend]),
  );

  return logsRes.data.map((log) => {
    const friend = friendLookup.get(log.friend_id);
    return {
      ...log,
      friendName: friend?.name ?? "Unknown",
      friendSlug: friend?.slug ?? "",
    };
  });
}

