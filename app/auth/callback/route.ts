import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { syncUser } from "@/app/actions/user";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const syncResult = await syncUser();

      if (!syncResult.success) {
        console.error("Failed to sync user:", syncResult.error);
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  console.error("Auth callback error or no code provided.");
  return NextResponse.redirect(
    `${origin}/auth/login?error=auth_callback_failed`
  );
}
