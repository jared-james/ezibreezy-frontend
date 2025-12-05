// app/join/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // CASE A: User appears to be Logged In
  if (session) {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    try {
      const response = await fetch(`${BACKEND_URL}/users/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          inviteToken: token,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Success: Redirect to the specific workspace they just joined
        if (data.targetWorkspaceId) {
          return NextResponse.redirect(
            new URL(
              `/dashboard?workspaceId=${data.targetWorkspaceId}&invite=success`,
              request.url
            )
          );
        }

        return NextResponse.redirect(
          new URL("/dashboard?invite=success", request.url)
        );
      }

      // Handle "Zombie Session" (401 Unauthorized)
      // This happens if the user exists in the browser (Supabase session)
      // but was deleted from the Backend Database.
      if (response.status === 401 || response.status === 403) {
        console.warn(
          "Invite processed with invalid/stale session. Signing out..."
        );
        await supabase.auth.signOut();
      }

      // FALL THROUGH: Do not error out.
      // We want to proceed to CASE B to save the cookie and let them Sign Up/Login again.
    } catch (error) {
      console.error("Network error processing invite:", error);
      // Fall through to Case B
    }
  }

  // CASE B: User is NOT Logged In (or was forced signed out above)
  const cookieStore = await cookies();

  // Persist the token so it survives the Login/Signup flow
  cookieStore.set("invite_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  // Redirect to Sign Up, but keep token in URL for visual confirmation if needed
  return NextResponse.redirect(
    new URL(`/auth/signup?token=${token}`, request.url)
  );
}
