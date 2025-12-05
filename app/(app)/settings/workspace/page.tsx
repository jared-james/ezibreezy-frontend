// app/(app)/settings/workspace/page.tsx

import WorkspaceSettingsClient from "./workspace-settings-client";

// Settings changes must be immediate - force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ workspaceId?: string }>;
}

export default async function WorkspaceSettingsPage({ searchParams }: PageProps) {
  // Extract workspaceId from URL (guaranteed by proxy)
  const params = await searchParams;
  const workspaceId = params.workspaceId!;

  // For future: Fetch workspace settings server-side
  // const settingsResult = await serverFetch(`/workspaces/${workspaceId}`, { workspaceId });

  return <WorkspaceSettingsClient workspaceId={workspaceId} />;
}
