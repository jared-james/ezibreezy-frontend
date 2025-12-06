// app/(app)/settings/workspace/page.tsx

import WorkspaceSettingsClient from "./workspace-settings-client";
import { getWorkspaceStructure } from "@/app/actions/workspaces";

// Settings changes must be immediate - force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WorkspaceSettingsPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  // Fetch workspace structure server-side
  const structureResult = await getWorkspaceStructure();
  const structure = structureResult.success ? structureResult.data : null;

  // Find the current workspace from the structure
  const currentWorkspace = structure?.workspaces?.find(
    (ws: any) => ws.slug === workspaceId || ws.id === workspaceId
  );

  return (
    <WorkspaceSettingsClient
      workspaceId={workspaceId}
      initialWorkspace={currentWorkspace}
    />
  );
}
