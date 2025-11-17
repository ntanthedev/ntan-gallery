import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin";
import { serverEnv } from "@/lib/env/server";
import { supabaseServiceRole } from "@/lib/supabase/service";

const MAX_BYTES = serverEnv.UPLOAD_MAX_SIZE_MB * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const friendId = formData.get("friendId");
  const slug = formData.get("slug");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File không hợp lệ." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        error: `File quá lớn (>${serverEnv.UPLOAD_MAX_SIZE_MB}MB).`,
      },
      { status: 413 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();

  const baseFolder =
    typeof friendId === "string" && friendId
      ? `friends/${friendId}`
      : `pending/${slug ?? "draft"}`;

  const sanitizedName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");

  const storagePath = `${baseFolder}/${Date.now()}-${sanitizedName}`;

  const { error: uploadError } = await supabaseServiceRole.storage
    .from(serverEnv.SUPABASE_STORAGE_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 },
    );
  }

  await supabaseServiceRole.from("uploads").insert({
    friend_id: typeof friendId === "string" ? friendId : null,
    storage_path: storagePath,
    file_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
  });

  return NextResponse.json({
    path: storagePath,
  });
}

