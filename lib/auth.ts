// lib/auth.ts

import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email!,
      displayName: user.user_metadata.displayName || user.email,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
