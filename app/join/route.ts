// app/join/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token");

  // If no token provided, redirect to home
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 1. Store the invite token in a secure, short-lived httpOnly cookie.
  // This allows the value to persist through the OAuth/Auth flow
  // so the callback route can access it later.
  const cookieStore = await cookies();

  cookieStore.set("invite_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour expiration
    path: "/",
  });

  // 2. Redirect to the Login page.
  // We append a query param so the Login UI can potentially show
  // a "You've been invited!" welcome message if you choose to implement that later.
  return NextResponse.redirect(new URL("/auth/login?flow=invite", request.url));
}
