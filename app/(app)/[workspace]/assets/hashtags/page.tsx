// app/(app)/[workspace]/assets/hashtags/page.tsx

import HashtagsClient from "./hashtags-client";

// Hashtags are frequently edited - force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HashtagsPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  // For future: Fetch hashtag groups server-side
  // const hashtagsResult = await serverFetch('/hashtag-groups', { workspaceId });

  return <HashtagsClient workspaceId={workspaceId} />;
}
