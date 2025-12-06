// app/(app)/ideas/page.tsx

import IdeasClient from "./ideas-client";

// Force dynamic rendering - no caching for ideas page (status updates)
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ workspace?: string; workspaceId?: string }>;
}

export default async function IdeasPage({ searchParams }: PageProps) {
  // Extract workspace from URL (guaranteed by proxy)
  const params = await searchParams;
  const workspaceId = params.workspace || params.workspaceId!;

  // For future: Fetch initial ideas data server-side
  // const ideasResult = await serverFetch('/ideas', { workspaceId });

  return <IdeasClient workspaceId={workspaceId} />;
}
