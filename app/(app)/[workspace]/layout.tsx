// app/(app)/[workspace]/layout.tsx

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getWorkspaceStructure } from "@/app/actions/workspaces";
import { OrganizationNode } from "@/lib/store/workspace-store";

interface WorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{ workspace: string }>;
}

/**
 * Workspace Layout
 *
 * This layout wraps all workspace-scoped routes (/:workspace/...)
 * It validates that the workspace slug exists and the user has access
 * BEFORE rendering children, preventing flash of unauthorized content.
 */
export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { workspace } = await params;

  // Server-side validation: Check if user has access to this workspace
  const workspaceResult = await getWorkspaceStructure();
  const workspaceStructure: OrganizationNode[] = workspaceResult.success
    ? (workspaceResult.data ?? [])
    : [];

  // Validate workspace exists in user's accessible workspaces
  const hasAccess = workspaceStructure.some((node) =>
    node.workspaces.some(
      (ws) => ws.slug === workspace || ws.id === workspace
    )
  );

  if (!hasAccess) {
    // Workspace not found or user doesn't have access
    notFound();
  }

  return <>{children}</>;
}
