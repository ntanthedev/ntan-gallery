import { z } from "zod";

const optionalText = z
  .string()
  .optional()
  .transform((value) => value?.trim() ?? "");

export const friendFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tên không được để trống."),
  slug: z
    .string()
    .min(1, "Slug không được để trống.")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang.")
    .transform((value) => value.toLowerCase()),
  nickname: optionalText,
  description: optionalText,
  letterContent: optionalText,
  mainPhoto: optionalText,
  galleryPhotos: z.array(z.string()).default([]),
  theme: z.object({
    primary: z.string().min(1),
    secondary: z.string().min(1),
  }),
  accessKey: optionalText,
  isPublished: z.boolean().default(true),
});

export type FriendFormValues = z.infer<typeof friendFormSchema>;

