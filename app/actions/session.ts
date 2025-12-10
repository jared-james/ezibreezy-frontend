// app/actions/session.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getClientSessionToken() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token || null;
}
