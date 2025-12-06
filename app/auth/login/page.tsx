// app/auth/login/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user && !error) {
    // A. Try cookie first (fastest redirect)
    const cookieStore = await cookies();
    const lastWorkspace = cookieStore.get("last_workspace_slug")?.value;

    if (lastWorkspace) {
      redirect(`/${lastWorkspace}/dashboard`);
    }

    // B. If no cookie, ask backend for default workspace
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const BACKEND_URL = process.env.BACKEND_URL;
        const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

        const res = await fetch(`${BACKEND_URL}/users/me/context`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "x-api-key": API_KEY || "",
          },
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.defaultWorkspaceSlug) {
            redirect(`/${data.defaultWorkspaceSlug}/dashboard`);
          }
        }
      }
    } catch (e) {
      // Allow Next.js redirect errors to bubble
      if (e instanceof Error && e.message === "NEXT_REDIRECT") {
        throw e;
      }
      console.error("Failed to fetch default workspace", e);
    }

    // C. Fallback if no workspace found
    redirect("/onboarding");
  }

  // Not logged in — show login form
  return <LoginForm />;
}
