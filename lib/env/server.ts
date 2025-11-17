import "server-only";

import { z } from "zod";

import { browserEnv } from "@/lib/env/browser";

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(32),
  FRIEND_TOKEN_SECRET: z.string().min(32),
  SUPABASE_STORAGE_BUCKET: z.string().min(1),
  ADMIN_ALLOWED_EMAIL: z
    .string()
    .email()
    .transform((value) => value.toLowerCase()),
  RATE_LIMIT_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(10),
  UPLOAD_MAX_SIZE_MB: z.coerce.number().int().positive().default(5),
});

export const serverEnv = {
  ...browserEnv,
  ...serverEnvSchema.parse(process.env),
};

export type ServerEnv = typeof serverEnv;

