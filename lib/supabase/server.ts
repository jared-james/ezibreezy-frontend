// lib/supabase/server.ts

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                // 🔒 FORCE SECURITY FLAGS
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              })
            );
          } catch {
            // This ignores errors if a Server Component tries to set cookies
            // (which isn't allowed, but Supabase SDK sometimes tries)
          }
        },
      },
    }
  );
}
