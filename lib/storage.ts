import { browserEnv } from "@/lib/env/browser";

/**
 * Generate public URL for a file in Supabase Storage
 * @param path - Storage path (e.g., "friends/123/image.jpg")
 * @param bucket - Storage bucket name (defaults to SUPABASE_STORAGE_BUCKET from env)
 */
export function getStoragePublicUrl(
  path: string | null | undefined,
  bucket?: string,
): string | null {
  if (!path) return null;

  const bucketName = bucket ?? "gallery-private";
  const baseUrl = browserEnv.NEXT_PUBLIC_SUPABASE_URL;

  return `${baseUrl}/storage/v1/object/public/${bucketName}/${path}`;
}

/**
 * Get multiple storage URLs at once
 */
export function getStoragePublicUrls(
  paths: (string | null | undefined)[],
  bucket?: string,
): (string | null)[] {
  return paths.map((path) => getStoragePublicUrl(path, bucket));
}
