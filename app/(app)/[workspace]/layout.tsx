// app/(app)/[workspace]/layout.tsx

import { ReactNode } from "react";

interface WorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{ workspace: string }>;
}

/**
 * Workspace Layout
 *
 * This layout wraps all workspace-scoped routes (/:workspace/...)
 * The workspace slug is available via params and can be used for validation.
 */
export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { workspace } = await params;

  // The workspace slug is available here if needed for future enhancements:
  // - Validate workspace exists and user has access
  // - Fetch workspace-specific configuration
  // - Set workspace-specific metadata

  // For now, we simply render the children
  // Workspace validation and context setting happens via:
  // 1. proxy.ts (ensures valid workspace in URL)
  // 2. WorkspaceHydrator (syncs workspace to Zustand store)

  return <>{children}</>;
}
