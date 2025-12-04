// app/join/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token");

  // If no token provided, redirect to home
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 1. Check if user is already authenticated
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // CASE A: User is ALREADY Logged In
  if (session) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
      // Call Backend to Sync/Accept Invite immediately
      await fetch(`${BACKEND_URL}/users/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          inviteToken: token, // <--- Pass the token here
        }),
      });

      // Redirect straight to dashboard with a success flag
      return NextResponse.redirect(
        new URL("/dashboard?invite=success", request.url)
      );
    } catch (error) {
      console.error("Auto-join failed:", error);
      return NextResponse.redirect(
        new URL("/dashboard?invite=error", request.url)
      );
    }
  }

  // CASE B: User is NOT Logged In (Existing Logic)
  // Store the invite token in a secure, short-lived httpOnly cookie.
  const cookieStore = await cookies();

  cookieStore.set("invite_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour expiration
    path: "/",
  });

  // Redirect to the Login page.
  return NextResponse.redirect(new URL("/auth/login?flow=invite", request.url));
}
