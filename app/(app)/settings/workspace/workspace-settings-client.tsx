// app/(app)/settings/workspace/workspace-settings-client.tsx

"use client";

import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { WorkspaceSettings } from "@/components/settings/workspace";

interface WorkspaceSettingsClientProps {
  workspaceId: string;
}

export default function WorkspaceSettingsClient({ workspaceId }: WorkspaceSettingsClientProps) {
  const { currentWorkspace } = useWorkspaceStore();

  return <WorkspaceSettings workspace={currentWorkspace} />;
}
