// app/auth/login/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserContext } from "@/app/actions/user";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user && !error) {
    // Ask backend for default workspace
    try {
      const result = await getUserContext();

      if (result.success && result.data?.defaultWorkspaceSlug) {
        redirect(`/${result.data.defaultWorkspaceSlug}/dashboard`);
      }
    } catch (e) {
      // Let Next.js redirect errors pass through
      if (e instanceof Error && e.message === "NEXT_REDIRECT") {
        throw e;
      }
      console.error("Failed to determine workspace context:", e);
    }

    // Fallback: no workspace, go to onboarding
    redirect("/onboarding");
  }

  // Not logged in — show login form
  return <LoginForm />;
}
