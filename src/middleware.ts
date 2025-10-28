import { NextRequest, NextResponse } from "next/server";
import { auth } from "./utils/auth";
import { betterFetch } from "@better-fetch/fetch";
import { UserType } from "@prisma/client";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const origin =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : request.nextUrl.origin;

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const path = request.nextUrl.pathname;
  const isPublicRoute = ["/login", "/sign-up", "/unauthorized"].includes(path);
  const isAdminRoute = path.startsWith("/admin");

  // If no session and not a public route, redirect to login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin route protection
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const isAdmin = session.user?.userType === UserType.ADMIN;
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
