"use client";

import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { WorkspaceSettings } from "@/components/settings/workspace";

export default function WorkspaceSettingsPage() {
  const { currentWorkspace } = useWorkspaceStore();

  return <WorkspaceSettings workspace={currentWorkspace} />;
}
