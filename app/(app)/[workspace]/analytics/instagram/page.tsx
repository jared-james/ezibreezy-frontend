// app/(app)/[workspace]/analytics/instagram/page.tsx

import InstagramClient from "./instagram-client";

// Analytics data is read-heavy and changes less frequently
// Cache for 5 minutes to reduce backend load
export const revalidate = 300;

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function InstagramAnalyticsPage({
  params,
}: PageProps) {
  const { workspace: workspaceId } = await params;

  // For future: Fetch Instagram analytics server-side
  // const analyticsResult = await serverFetch('/analytics/instagram', { workspaceId });

  return <InstagramClient workspaceId={workspaceId} />;
}
