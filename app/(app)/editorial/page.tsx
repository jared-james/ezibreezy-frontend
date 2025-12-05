// app/(app)/editorial/page.tsx

import EditorialClient from "./editorial-client";

// Force dynamic rendering - CRITICAL: avoid stale draft state
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ workspaceId?: string }>;
}

export default async function EditorialPage({ searchParams }: PageProps) {
  // Extract workspaceId from URL (guaranteed by proxy)
  const params = await searchParams;
  const workspaceId = params.workspaceId!;

  // For future: Fetch draft data and integrations server-side
  // const draftResult = await serverFetch('/drafts', { workspaceId });
  // const integrationsResult = await serverFetch('/integrations', { workspaceId });

  return <EditorialClient workspaceId={workspaceId} />;
}
