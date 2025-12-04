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

  const urlInviteToken = requestUrl.searchParams.get("invite_token");

  if (code) {
    const cookieStore = await cookies();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      if (error.message.includes("code verifier")) {
        return NextResponse.redirect(`${origin}/auth/login?error=link_expired`);
      }
      return NextResponse.redirect(
        `${origin}/auth/login?error=auth_callback_failed`
      );
    }

    if (!data.session) {
      return NextResponse.redirect(
        `${origin}/auth/login?error=auth_callback_failed`
      );
    }

    if (!data.user.email_confirmed_at) {
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

    if (cookieStore.get("invite_token")) {
      cookieStore.delete("invite_token");
    }

    // FIX: Use Query Parameter
    if (syncResult.targetWorkspaceId) {
      return NextResponse.redirect(
        `${origin}/dashboard?workspaceId=${syncResult.targetWorkspaceId}&invite=success`
      );
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(
    `${origin}/auth/login?error=auth_callback_failed`
  );
}
