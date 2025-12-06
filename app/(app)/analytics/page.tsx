// app/(app)/analytics/page.tsx

import AnalyticsClient from "./analytics-client";

// Analytics data is read-heavy and changes less frequently
// Cache for 5 minutes to reduce backend load
export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ workspace?: string; workspaceId?: string }>;
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  // Extract workspace from URL (guaranteed by proxy)
  const params = await searchParams;
  const workspaceId = params.workspace || params.workspaceId!;

  // For future: Fetch analytics summaries server-side
  // const summaryResult = await serverFetch('/analytics/summary', { workspaceId });

  return <AnalyticsClient workspaceId={workspaceId} />;
}
