import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { createFriendSessionToken, buildFriendCookie } from "@/lib/auth/friend";
import { getFriendBySlug } from "@/lib/data/friends";
import { logAccessAttempt } from "@/lib/data/access-logs";
import { getClientIp } from "@/lib/http/ip";
import { consumeRateLimit } from "@/lib/rate-limit";

const verifySchema = z.object({
  slug: z.string().min(1),
  accessKey: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = verifySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ." },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);

  try {
    const rate = await consumeRateLimit(ip);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Bạn thử quá nhanh, vui lòng đợi thêm trước khi nhập lại.",
          blockedUntil: rate.blockedUntil,
        },
        { status: 429 },
      );
    }

    const friend = await getFriendBySlug(parsed.data.slug);

    if (!friend || !friend.is_published) {
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ cần mở khóa." },
        { status: 404 },
      );
    }

    const isValidKey = await bcrypt.compare(
      parsed.data.accessKey,
      friend.access_key_hash,
    );

    const userAgent = request.headers.get("user-agent") ?? undefined;

    if (!isValidKey) {
      await logAccessAttempt({
        friendId: friend.id,
        success: false,
        ip,
        userAgent,
        failureReason: "INVALID_KEY",
      });

      return NextResponse.json(
        { error: "Key không đúng, thử lại nhé." },
        { status: 401 },
      );
    }

    const { token, expiresAt } = await createFriendSessionToken({
      friendId: friend.id,
      slug: friend.slug,
    });

    const response = NextResponse.json({
      success: true,
      expiresAt: expiresAt.toISOString(),
      friend: {
        id: friend.id,
        name: friend.name,
        nickname: friend.nickname,
        description: friend.description,
        mainPhoto: friend.main_photo,
        galleryPhotos: friend.gallery_photos,
        letterContent: friend.letter_content,
        themeConfig: friend.theme_config,
      },
    });

    response.cookies.set(buildFriendCookie(friend.slug, token, expiresAt));

    await logAccessAttempt({
      friendId: friend.id,
      success: true,
      ip,
      userAgent,
    });

    return response;
  } catch (error) {
    console.error("[verify-key]", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra, thử lại sau nhé." },
      { status: 500 },
    );
  }
}

