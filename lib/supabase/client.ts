// lib/supabase/client.ts

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      console.log("User signed out");
    }
    if (event === "TOKEN_REFRESHED") {
      console.log("Token refreshed successfully");
    }
  });

  return supabase;
}
