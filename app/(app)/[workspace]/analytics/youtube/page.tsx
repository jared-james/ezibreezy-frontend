// app/(app)/analytics/youtube/page.tsx

import YoutubeClient from "./youtube-client";

// Analytics data is read-heavy and changes less frequently
// Cache for 5 minutes to reduce backend load
export const revalidate = 300;

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function YoutubeAnalyticsPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  // For future: Fetch YouTube analytics server-side
  // const analyticsResult = await serverFetch('/analytics/youtube', { workspaceId });

  return <YoutubeClient workspaceId={workspaceId} />;
}
