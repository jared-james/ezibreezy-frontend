// app/(app)/[workspace]/assets/hashtags/page.tsx

import HashtagsClient from "./hashtags-client";
import { listHashtagGroupsAction } from "@/app/actions/hashtags";

// Hashtags are frequently edited - force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HashtagsPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  const hashtagsResult = await listHashtagGroupsAction(workspaceId);

  return (
    <HashtagsClient
      workspaceId={workspaceId}
      initialData={hashtagsResult.success ? hashtagsResult.data : undefined}
    />
  );
}
