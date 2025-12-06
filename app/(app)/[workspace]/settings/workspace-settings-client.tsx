// app/(app)/[workspace]/settings/workspace-settings-client.tsx

// app/(app)/settings/workspace/workspace-settings-client.tsx

"use client";

import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { WorkspaceSettings } from "@/components/settings/workspace";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
}

interface WorkspaceSettingsClientProps {
  workspaceId: string;
  initialWorkspace?: Workspace;
}

export default function WorkspaceSettingsClient({
  workspaceId,
  initialWorkspace,
}: WorkspaceSettingsClientProps) {
  const { currentWorkspace } = useWorkspaceStore();

  // Use server-provided initialWorkspace first, then fall back to store
  const workspace = initialWorkspace || currentWorkspace;

  // Combine URL workspaceId with workspace data
  // This ensures we always have the identifier even if neither source is available yet
  const workspaceWithId = workspace
    ? {
        ...workspace,
        // Ensure we have the identifier from URL as fallback
        slug: workspace.slug || workspaceId,
      }
    : null;

  return (
    <WorkspaceSettings
      workspace={workspaceWithId}
      workspaceIdFromUrl={workspaceId}
    />
  );
}
