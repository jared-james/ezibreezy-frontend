// app/(app)/[workspace]/editorial/page.tsx

import EditorialClient from "./editorial-client";

// Force dynamic rendering - CRITICAL: avoid stale draft state
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EditorialPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  // For future: Fetch draft data and integrations server-side
  // const draftResult = await serverFetch('/drafts', { workspaceId });
  // const integrationsResult = await serverFetch('/integrations', { workspaceId });

  return <EditorialClient workspaceId={workspaceId} />;
}
