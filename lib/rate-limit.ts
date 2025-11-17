import "server-only";

import { serverEnv } from "@/lib/env/server";
import { supabaseServiceRole } from "@/lib/supabase/service";

type RateLimitResult =
  | {
      allowed: true;
      attempts: number;
      remaining: number;
    }
  | {
      allowed: false;
      attempts: number;
      remaining: number;
      blockedUntil: string;
    };

const WINDOW_MS = serverEnv.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;

export async function consumeRateLimit(ip: string): Promise<RateLimitResult> {
  const now = new Date();

  const { data, error } = await supabaseServiceRole
    .from("rate_limits")
    .select("*")
    .eq("ip", ip)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data?.blocked_until) {
    const blockedUntil = new Date(data.blocked_until);
    if (blockedUntil > now) {
      return {
        allowed: false,
        attempts: data.attempts,
        remaining: 0,
        blockedUntil: blockedUntil.toISOString(),
      };
    }
  }

  const withinWindow =
    data && now.getTime() - new Date(data.last_attempt).getTime() < WINDOW_MS;

  const newAttempts = withinWindow ? (data?.attempts ?? 0) + 1 : 1;

  const reachedLimit = newAttempts > serverEnv.RATE_LIMIT_MAX_ATTEMPTS;
  const blockedUntil = reachedLimit
    ? new Date(now.getTime() + WINDOW_MS).toISOString()
    : null;

  await supabaseServiceRole.from("rate_limits").upsert({
    ip,
    attempts: reachedLimit
      ? serverEnv.RATE_LIMIT_MAX_ATTEMPTS
      : newAttempts,
    last_attempt: now.toISOString(),
    blocked_until: blockedUntil,
  });

  if (reachedLimit && blockedUntil) {
    return {
      allowed: false,
      attempts: newAttempts,
      remaining: 0,
      blockedUntil,
    };
  }

  return {
    allowed: true,
    attempts: newAttempts,
    remaining: Math.max(
      serverEnv.RATE_LIMIT_MAX_ATTEMPTS - newAttempts,
      0,
    ),
  };
}

