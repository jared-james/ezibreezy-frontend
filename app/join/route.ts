// app/join/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { syncUser } from "@/app/actions/user";

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
    try {
      const result = await syncUser({ inviteToken: token });

      if (result.success) {
        // Success: Redirect to the specific workspace they just joined
        if (result.targetWorkspaceSlug) {
          return NextResponse.redirect(
            new URL(
              `/${result.targetWorkspaceSlug}/dashboard?invite=success`,
              request.url
            )
          );
        } else if (result.targetWorkspaceId) {
          return NextResponse.redirect(
            new URL(
              `/${result.targetWorkspaceId}/dashboard?invite=success`,
              request.url
            )
          );
        }

        return NextResponse.redirect(
          new URL("/dashboard?invite=success", request.url)
        );
      }

      // Handle "Zombie Session" (401 Unauthorized or 403 Forbidden)
      // This happens if the user exists in the browser (Supabase session)
      // but was deleted from the Backend Database.
      if (
        "statusCode" in result &&
        (result.statusCode === 401 || result.statusCode === 403)
      ) {
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
