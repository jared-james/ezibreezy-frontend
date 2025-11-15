// lib/auth.ts

import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email!,
    displayName: user.user_metadata?.displayName || user.email!,
  };
}
