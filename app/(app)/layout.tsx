// app/(app)/layout.tsx

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SidebarClient from "@/components/sidebar-client";
import { getWorkspaceStructure } from "@/app/actions/workspaces";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Server-side Auth Check
  // We use the lighter `getCurrentUser` here just to verify session & get display name.
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 2. Fetch workspace structure server-side
  // This ensures data is available before client components mount,
  // preventing the "Loading..." state in the workspace switcher
  const workspaceResult = await getWorkspaceStructure();
  const workspaceStructure = workspaceResult.success
    ? workspaceResult.data
    : [];

  console.log("🔵 [Layout] Workspace fetch result:", {
    success: workspaceResult.success,
    dataLength: workspaceStructure.length,
    error: workspaceResult.error,
    structure: workspaceStructure,
  });

  return (
    <div className="flex h-screen w-full bg-[--background] overflow-hidden">
      {/*
        Sidebar
        We pass both the user's name and the workspace structure.
        The sidebar will initialize the Zustand store with this data immediately.
      */}
      <SidebarClient
        displayName={user.displayName}
        initialStructure={workspaceStructure}
      />

      {/* Main Scrollable Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto scroll-smooth">{children}</div>
      </main>
    </div>
  );
}
