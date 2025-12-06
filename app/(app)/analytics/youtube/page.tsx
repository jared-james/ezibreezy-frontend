// app/(app)/analytics/youtube/page.tsx

import YoutubeClient from "./youtube-client";

// Analytics data is read-heavy and changes less frequently
// Cache for 5 minutes to reduce backend load
export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ workspace?: string; workspaceId?: string }>;
}

export default async function YoutubeAnalyticsPage({ searchParams }: PageProps) {
  // Extract workspace from URL (guaranteed by proxy)
  const params = await searchParams;
  const workspaceId = params.workspace || params.workspaceId!;

  // For future: Fetch YouTube analytics server-side
  // const analyticsResult = await serverFetch('/analytics/youtube', { workspaceId });

  return <YoutubeClient workspaceId={workspaceId} />;
}
