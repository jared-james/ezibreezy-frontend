// app/auth/login/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserContext } from "@/app/actions/user";
import { getWorkspaceStructure } from "@/app/actions/workspaces";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user && !error) {
    // Strategy 1: Use backend user context (preferred)
    try {
      const contextResult = await getUserContext();

      if (contextResult.success && contextResult.data?.defaultWorkspaceSlug) {
        redirect(`/${contextResult.data.defaultWorkspaceSlug}/dashboard`);
      }
    } catch (e) {
      // Allow Next.js redirects to pass through
      if (e instanceof Error && e.message === "NEXT_REDIRECT") {
        throw e;
      }
      console.warn("Strategy 1 failed: could not get default workspace", e);
    }

    // Strategy 2: Fallback to first workspace from structure
    try {
      const structureResult = await getWorkspaceStructure();
      const structure = structureResult.success
        ? structureResult.data ?? []
        : [];

      const firstAvailableWorkspace = structure
        .flatMap((org: any) => org.workspaces || [])
        .find((ws: any) => ws.slug);

      if (firstAvailableWorkspace) {
        redirect(`/${firstAvailableWorkspace.slug}/dashboard`);
      }
    } catch (e) {
      if (e instanceof Error && e.message === "NEXT_REDIRECT") {
        throw e;
      }
      console.error("Strategy 2 failed: could not read workspace structure", e);
    }

    // Strategy 3: No workspaces — send to onboarding
    redirect("/onboarding");
  }

  // Not logged in — show login form
  return <LoginForm />;
}
