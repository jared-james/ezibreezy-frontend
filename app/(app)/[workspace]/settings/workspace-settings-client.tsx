// app/(app)/[workspace]/settings/workspace-settings-client.tsx

// app/(app)/settings/workspace/workspace-settings-client.tsx

"use client";

import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { WorkspaceSettings } from "@/components/settings/workspace";

interface WorkspaceSettingsClientProps {
  workspaceId: string;
}

export default function WorkspaceSettingsClient({
  workspaceId,
}: WorkspaceSettingsClientProps) {
  const { currentWorkspace } = useWorkspaceStore();

  // Combine URL workspaceId with store data
  // This ensures we always have the identifier even if store isn't hydrated yet
  const workspaceWithId = currentWorkspace
    ? {
        ...currentWorkspace,
        // Ensure we have the identifier from URL as fallback
        slug: currentWorkspace.slug || workspaceId,
      }
    : null;

  return (
    <WorkspaceSettings
      workspace={workspaceWithId}
      workspaceIdFromUrl={workspaceId}
    />
  );
}
