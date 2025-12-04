// app/auth/confirm/route.ts

import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUser } from "@/app/actions/user";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const cookieStore = await cookies();
    const supabase = await createClient();

    // Verify the OTP token hash
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error("Failed to verify OTP:", {
        error: error.message,
        code: error.code,
        type,
      });
      return NextResponse.redirect(
        `${origin}/auth/login?error=verification_failed`
      );
    }

    // Get the session after verification
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error("No session after OTP verification");
      return NextResponse.redirect(
        `${origin}/auth/login?error=verification_failed`
      );
    }

    // Check if email is verified (should be true after email confirmation)
    if (type === "email" && !session.user.email_confirmed_at) {
      console.error("Email still not verified after confirmation");
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/auth/login?error=email_not_verified`
      );
    }

    // Check for an invite token in the cookies
    const inviteToken = cookieStore.get("invite_token")?.value;

    // Sync User with Backend (passing the token if it exists)
    const syncResult = await syncUser({ inviteToken });

    if (!syncResult.success) {
      console.error("Failed to sync user:", syncResult.error);
      // Sign out the user since sync failed
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/auth/login?error=sync_failed`);
    }

    // Cleanup: Remove the invite cookie
    if (inviteToken) {
      cookieStore.delete("invite_token");
    }

    // Redirect to the specified next URL or dashboard
    return NextResponse.redirect(`${origin}${next}`);
  }

  // No token_hash or type provided
  console.error("Auth confirm error: no token_hash or type provided");
  return NextResponse.redirect(
    `${origin}/auth/login?error=verification_failed`
  );
}
