// app/auth/confirm/route.ts

import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUser } from "@/app/actions/user";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  const urlInviteToken = searchParams.get("invite_token");

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      return NextResponse.redirect(
        `${origin}/auth/login?error=verification_failed`
      );
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(
        `${origin}/auth/login?error=verification_failed`
      );
    }

    if (type === "email" && !session.user.email_confirmed_at) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/auth/login?error=email_not_verified`
      );
    }

    const syncResult = await syncUser({
      inviteToken: urlInviteToken || undefined,
    });

    if (!syncResult.success) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/auth/login?error=sync_failed`);
    }

    // FIX: Use Query Parameter instead of Path
    if (syncResult.targetWorkspaceId) {
      return NextResponse.redirect(
        `${origin}/dashboard?workspaceId=${syncResult.targetWorkspaceId}&invite=success`
      );
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(
    `${origin}/auth/login?error=verification_failed`
  );
}
