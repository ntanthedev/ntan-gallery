import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import { serverEnv } from "@/lib/env/server";

const FRIEND_COOKIE_PREFIX = "friend_token_";
const FRIEND_SESSION_TTL_SECONDS = 60 * 30; // 30 phút
const friendSecret = new TextEncoder().encode(serverEnv.FRIEND_TOKEN_SECRET);

type FriendTokenPayload = {
  friendId: string;
  slug: string;
};

export async function createFriendSessionToken(
  payload: FriendTokenPayload,
) {
  const expiresAt = new Date(Date.now() + FRIEND_SESSION_TTL_SECONDS * 1000);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(friendSecret);

  return { token, expiresAt };
}

export async function verifyFriendSessionToken(
  token: string,
  slug: string,
) {
  try {
    const { payload } = await jwtVerify(token, friendSecret, {
      algorithms: ["HS256"],
    });

    if (payload.slug !== slug) {
      return null;
    }

    return {
      friendId: payload.friendId as string,
      slug: payload.slug as string,
    };
  } catch {
    return null;
  }
}

export function getFriendCookieName(slug: string) {
  return `${FRIEND_COOKIE_PREFIX}${slug}`;
}

export function buildFriendCookie(
  slug: string,
  token: string,
  expiresAt: Date,
) {
  return {
    name: getFriendCookieName(slug),
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: true,
    path: `/friend/${slug}`,
    expires: expiresAt,
  };
}

export async function getFriendSessionFromCookies(slug: string) {
  const cookieStore = cookies();
  const token = cookieStore.get(getFriendCookieName(slug))?.value;
  if (!token) {
    return null;
  }

  return verifyFriendSessionToken(token, slug);
}

export function clearFriendSession(slug: string) {
  const cookieStore = cookies();
  cookieStore.set({
    name: getFriendCookieName(slug),
    value: "",
    path: `/friend/${slug}`,
    expires: new Date(0),
  });
}

