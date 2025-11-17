"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/admin";
import { friendFormSchema, type FriendFormValues } from "@/app/admin/friends/schema";
import { getFriendById } from "@/lib/data/friends";
import { supabaseServiceRole } from "@/lib/supabase/service";

async function getNextOrderIndex() {
  const { data } = await supabaseServiceRole
    .from("friends")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return 1;
  }

  return (data.order_index ?? 0) + 1;
}

export async function saveFriendAction(values: FriendFormValues) {
  await requireAdminSession();
  const parsed = friendFormSchema.parse(values);

  const existing = parsed.id ? await getFriendById(parsed.id) : null;

  if (!existing && !parsed.accessKey) {
    throw new Error("Bạn cần nhập access key cho friend mới.");
  }

  const accessKeyHash = parsed.accessKey
    ? await bcrypt.hash(parsed.accessKey, 12)
    : existing?.access_key_hash;

  const orderIndex = existing?.order_index ?? (await getNextOrderIndex());

  const payload = {
    id: existing?.id ?? undefined,
    name: parsed.name,
    slug: parsed.slug,
    nickname: parsed.nickname || null,
    description: parsed.description || null,
    letter_content: parsed.letterContent || null,
    main_photo: parsed.mainPhoto || null,
    gallery_photos: parsed.galleryPhotos,
    theme_config: {
      primary: parsed.theme.primary,
      secondary: parsed.theme.secondary,
    },
    is_published: parsed.isPublished,
    order_index: orderIndex,
    access_key_hash: accessKeyHash,
  };

  const { data, error } = await supabaseServiceRole
    .from("friends")
    .upsert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (parsed.galleryPhotos.length) {
    await supabaseServiceRole
      .from("uploads")
      .update({ friend_id: data.id })
      .in("storage_path", parsed.galleryPhotos);
  }

  revalidatePath("/admin/friends");
  revalidatePath("/admin");
  revalidatePath(`/friend/${data.slug}`);
  if (existing?.slug && existing.slug !== data.slug) {
    revalidatePath(`/friend/${existing.slug}`);
  }

  return { success: true, friendId: data.id };
}

export async function deleteFriendAction(friendId: string) {
  await requireAdminSession();

  const { error } = await supabaseServiceRole
    .from("friends")
    .delete()
    .eq("id", friendId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/friends");
  revalidatePath("/admin");
}

export async function reorderFriendsAction(order: string[]) {
  await requireAdminSession();

  await Promise.all(
    order.map((id, index) =>
      supabaseServiceRole
        .from("friends")
        .update({ order_index: index + 1 })
        .eq("id", id),
    ),
  );

  revalidatePath("/admin/friends");
  revalidatePath("/admin");
}

export async function togglePublishAction(params: {
  friendId: string;
  isPublished: boolean;
}) {
  await requireAdminSession();
  const { data, error } = await supabaseServiceRole
    .from("friends")
    .update({ is_published: params.isPublished })
    .eq("id", params.friendId)
    .select("slug")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/friends");
  revalidatePath("/admin");
  if (data?.slug) {
    revalidatePath(`/friend/${data.slug}`);
  }
}

