import "server-only";

import { supabaseServiceRole } from "@/lib/supabase/service";

type LogPayload = {
  friendId: string;
  success: boolean;
  ip?: string | null;
  userAgent?: string | null;
  failureReason?: string | null;
};

export async function logAccessAttempt({
  friendId,
  success,
  ip,
  userAgent,
  failureReason,
}: LogPayload) {
  await supabaseServiceRole.from("access_logs").insert({
    friend_id: friendId,
    success,
    ip_address: ip ?? null,
    user_agent: userAgent ?? null,
    failure_reason: failureReason ?? null,
  });
}

