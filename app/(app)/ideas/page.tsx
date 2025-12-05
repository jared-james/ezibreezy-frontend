// app/(app)/ideas/page.tsx

import IdeasClient from "./ideas-client";

// Force dynamic rendering - no caching for ideas page (status updates)
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ workspaceId?: string }>;
}

export default async function IdeasPage({ searchParams }: PageProps) {
  // Extract workspaceId from URL (guaranteed by proxy)
  const params = await searchParams;
  const workspaceId = params.workspaceId!;

  // For future: Fetch initial ideas data server-side
  // const ideasResult = await serverFetch('/ideas', { workspaceId });

  return <IdeasClient workspaceId={workspaceId} />;
}
