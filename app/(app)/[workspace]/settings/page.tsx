// app/(app)/settings/workspace/page.tsx

import WorkspaceSettingsClient from "./workspace-settings-client";

// Settings changes must be immediate - force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WorkspaceSettingsPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  // For future: Fetch workspace settings server-side
  // const settingsResult = await serverFetch(`/workspaces/${workspaceId}`, { workspaceId });

  return <WorkspaceSettingsClient workspaceId={workspaceId} />;
}
