import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { serverEnv } from "@/lib/env/server";
import type { Database } from "@/types/database";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          });
        },
      },
      headers: {
        "x-forwarded-for": request.headers.get("x-forwarded-for") ?? undefined,
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const allowedEmail = serverEnv.ADMIN_ALLOWED_EMAIL;
  const isLoginRoute = request.nextUrl.pathname.startsWith("/admin/login");
  const isAuthorized =
    !!session && session.user.email?.toLowerCase() === allowedEmail;

  if (!isAuthorized && !isLoginRoute) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("redirect_to", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthorized && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

