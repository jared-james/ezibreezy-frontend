// app/(app)/layout.tsx

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceStructure } from "@/app/actions/workspaces";
import SidebarClient from "@/components/sidebar/sidebar-client";
import { InviteToast } from "@/components/auth/invite-toast";
import { WorkspaceHydrator } from "@/components/workspace/workspace-hydrator";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch workspace structure
  const workspaceResult = await getWorkspaceStructure();

  // If backend sync failed, sign out and force login
  if (!workspaceResult.success) {
    console.error(
      "User has valid session but failed backend sync. Logging out."
    );
    await supabase.auth.signOut();
    redirect("/auth/login?error=sync_failed");
  }

  const workspaceStructure = workspaceResult.data ?? [];

  // No workspaces? Send to onboarding
  if (workspaceStructure.length === 0) {
    redirect("/onboarding");
  }

  // Resolve display name
  const displayName =
    user.user_metadata?.displayName ||
    user.user_metadata?.full_name ||
    user.email ||
    "Editor";

  return (
    <div className="flex">
      <InviteToast />

      <Suspense fallback={null}>
        <WorkspaceHydrator structure={workspaceStructure} />
      </Suspense>

      <SidebarClient
        displayName={displayName}
        initialStructure={workspaceStructure}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div>{children}</div>
      </main>
    </div>
  );
}
