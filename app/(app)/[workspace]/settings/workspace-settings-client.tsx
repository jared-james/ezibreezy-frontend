// app/(app)/[workspace]/settings/workspace-settings-client.tsx

"use client";

import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { WorkspaceSettings } from "@/components/settings/workspace";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  role?: "admin" | "editor" | "viewer";
}

interface WorkspaceSettingsClientProps {
  workspaceId: string;
  initialWorkspace?: Workspace;
  userOrgRole?: string;
}

export default function WorkspaceSettingsClient({
  workspaceId,
  initialWorkspace,
  userOrgRole = "member",
}: WorkspaceSettingsClientProps) {
  const { currentWorkspace } = useWorkspaceStore();

  const workspace = initialWorkspace || currentWorkspace;

  const workspaceWithId = workspace
    ? {
        ...workspace,
        slug: workspace.slug || workspaceId,
      }
    : null;

  return (
    <WorkspaceSettings
      workspace={workspaceWithId}
      workspaceIdFromUrl={workspaceId}
      userOrgRole={userOrgRole}
    />
  );
}
