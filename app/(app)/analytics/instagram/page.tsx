// app/(app)/analytics/instagram/page.tsx

import InstagramClient from "./instagram-client";

// Analytics data is read-heavy and changes less frequently
// Cache for 5 minutes to reduce backend load
export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ workspace?: string; workspaceId?: string }>;
}

export default async function InstagramAnalyticsPage({ searchParams }: PageProps) {
  // Extract workspace from URL (guaranteed by proxy)
  const params = await searchParams;
  const workspaceId = params.workspace || params.workspaceId!;

  // For future: Fetch Instagram analytics server-side
  // const analyticsResult = await serverFetch('/analytics/instagram', { workspaceId });

  return <InstagramClient workspaceId={workspaceId} />;
}
