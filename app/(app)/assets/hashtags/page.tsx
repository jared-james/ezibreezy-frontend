// app/(app)/assets/hashtags/page.tsx

import HashtagsClient from "./hashtags-client";

// Hashtags are frequently edited - force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ workspace?: string; workspaceId?: string }>;
}

export default async function HashtagsPage({ searchParams }: PageProps) {
  // Extract workspace from URL (guaranteed by proxy)
  const params = await searchParams;
  const workspaceId = params.workspace || params.workspaceId!;

  // For future: Fetch hashtag groups server-side
  // const hashtagsResult = await serverFetch('/hashtag-groups', { workspaceId });

  return <HashtagsClient workspaceId={workspaceId} />;
}
