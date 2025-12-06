// app/(app)/[workspace]/layout.tsx

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getWorkspaceStructure } from "@/app/actions/workspaces";
import { OrganizationNode } from "@/lib/store/workspace-store";

interface WorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{ workspace: string }>;
}

// Validates that the current workspace slug is accessible to the user
export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { workspace } = await params;

  // Fetch user's accessible workspaces
  const workspaceResult = await getWorkspaceStructure();
  const workspaceStructure: OrganizationNode[] = workspaceResult.success
    ? workspaceResult.data ?? []
    : [];

  // Check if requested workspace is accessible
  const hasAccess = workspaceStructure.some((node) =>
    node.workspaces.some((ws) => ws.slug === workspace || ws.id === workspace)
  );

  if (!hasAccess) {
    notFound();
  }

  return <>{children}</>;
}
