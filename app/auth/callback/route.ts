// app/auth/callback/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { syncUser } from "@/app/actions/user";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next");
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

    // Handle onboarding_required event - redirect to onboarding
    if (syncResult.event === "onboarding_required") {
      return NextResponse.redirect(`${origin}/onboarding`);
    }

    // Handle invite_accepted or login - redirect to workspace
    if (syncResult.targetWorkspaceSlug) {
      const inviteParam = syncResult.event === "invite_accepted" ? "?invite=success" : "";
      return NextResponse.redirect(
        `${origin}/${syncResult.targetWorkspaceSlug}/dashboard${inviteParam}`
      );
    } else if (syncResult.targetWorkspaceId) {
      const inviteParam = syncResult.event === "invite_accepted" ? "?invite=success" : "";
      return NextResponse.redirect(
        `${origin}/${syncResult.targetWorkspaceId}/dashboard${inviteParam}`
      );
    }

    // Fallback: If we have a next parameter and it's a relative path, use it
    // Otherwise default to /dashboard
    const fallbackPath = nextParam && nextParam.startsWith('/') ? nextParam : '/dashboard';
    return NextResponse.redirect(`${origin}${fallbackPath}`);
  }

  return NextResponse.redirect(
    `${origin}/auth/login?error=auth_callback_failed`
  );
}
