// app/auth/callback/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { syncUser } from "@/app/actions/user";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();
    const supabase = await createClient();

    // 1. Exchange the Auth Code for a Session
    // The @supabase/ssr client will automatically handle PKCE if the verifier is in cookies
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Failed to exchange code for session:", {
        error: error.message,
        code: error.code,
        status: error.status,
      });

      // If PKCE verifier is missing, this is likely an old/expired link
      if (error.message.includes("code verifier")) {
        return NextResponse.redirect(`${origin}/auth/login?error=link_expired`);
      }

      return NextResponse.redirect(
        `${origin}/auth/login?error=auth_callback_failed`
      );
    }

    if (!data.session) {
      console.error("No session returned after code exchange");
      return NextResponse.redirect(
        `${origin}/auth/login?error=auth_callback_failed`
      );
    }

    // 2. Check if email is verified
    if (!data.user.email_confirmed_at) {
      console.error("Email not verified for user:", data.user.email);
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/auth/login?error=email_not_verified`
      );
    }

    // 3. Check for an invite token in the cookies
    const inviteToken = cookieStore.get("invite_token")?.value;

    // 4. Sync User with Backend (passing the token if it exists)
    const syncResult = await syncUser({ inviteToken });

    if (!syncResult.success) {
      console.error("Failed to sync user:", syncResult.error);
      // Sign out the user since sync failed
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/auth/login?error=sync_failed`);
    }

    // 5. Cleanup: Remove the invite cookie so it doesn't trigger again later
    if (inviteToken) {
      cookieStore.delete("invite_token");
    }

    // 6. Redirect to Dashboard or next URL
    return NextResponse.redirect(`${origin}${next}`);
  }

  console.error("Auth callback error or no code provided.");
  return NextResponse.redirect(
    `${origin}/auth/login?error=auth_callback_failed`
  );
}
