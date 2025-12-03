// app/auth/callback/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { syncUser } from "@/app/actions/user";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    // 1. Exchange the Auth Code for a Session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // 2. Check for an invite token in the cookies
      // This allows us to link the user to a workspace even if they just signed up
      const cookieStore = await cookies();
      const inviteToken = cookieStore.get("invite_token")?.value;

      // 3. Sync User with Backend (passing the token if it exists)
      const syncResult = await syncUser({ inviteToken });

      if (!syncResult.success) {
        console.error("Failed to sync user:", syncResult.error);
        // We might want to redirect to an error page here,
        // or just let them through to the dashboard but show a toast later.
        // For now, we let them through, but the workspace won't be linked if sync failed.
      }

      // 4. Cleanup: Remove the invite cookie so it doesn't trigger again later
      if (inviteToken) {
        cookieStore.delete("invite_token");
      }

      // 5. Redirect to Dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  console.error("Auth callback error or no code provided.");
  return NextResponse.redirect(
    `${origin}/auth/login?error=auth_callback_failed`
  );
}
