// app/(app)/[workspace]/analytics/page.tsx

import AnalyticsClient from "./analytics-client";

// Analytics data is read-heavy and changes less frequently
// Cache for 5 minutes to reduce backend load
export const revalidate = 300;

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  // For future: Fetch analytics summaries server-side
  // const summaryResult = await serverFetch('/analytics/summary', { workspaceId });

  return <AnalyticsClient workspaceId={workspaceId} />;
}
