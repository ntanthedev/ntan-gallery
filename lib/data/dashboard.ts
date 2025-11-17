import "server-only";

import { supabaseServiceRole } from "@/lib/supabase/service";

export async function getDashboardStats() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [friendsRes, logsRes] = await Promise.all([
    supabaseServiceRole
      .from("friends")
      .select("*")
      .order("order_index", { ascending: true }),
    supabaseServiceRole
      .from("access_logs")
      .select("friend_id, success, accessed_at")
      .gte("accessed_at", sevenDaysAgo.toISOString())
      .order("accessed_at", { ascending: false }),
  ]);

  if (friendsRes.error) {
    throw new Error(friendsRes.error.message);
  }

  if (logsRes.error) {
    throw new Error(logsRes.error.message);
  }

  const totalFriends = friendsRes.data.length;
  const publishedFriends = friendsRes.data.filter(
    (friend) => friend.is_published,
  ).length;
  const totalViews = logsRes.data.filter((log) => log.success).length;

  const latestLogs = logsRes.data.slice(0, 10);

  const viewsPerFriend = logsRes.data.reduce<Record<string, number>>(
    (acc, log) => {
      if (log.success) {
        acc[log.friend_id] = (acc[log.friend_id] ?? 0) + 1;
      }
      return acc;
    },
    {},
  );

  return {
    totalFriends,
    publishedFriends,
    totalViews,
    friends: friendsRes.data.map((friend) => ({
      ...friend,
      views: viewsPerFriend[friend.id] ?? 0,
    })),
    latestLogs,
  };
}

