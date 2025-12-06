// app/(app)/calendar/page.tsx

import CalendarClient from "./calendar-client";
import { serverFetch } from "@/lib/api/server-fetch";
import type { ScheduledPostResponse } from "@/lib/api/publishing";

// Force dynamic to ensure we fetch fresh data on every navigation
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ workspaceId?: string }>;
}

export default async function CalendarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const workspaceId = params.workspaceId;

  if (!workspaceId) {
    // If caught by proxy.ts, this shouldn't happen, but safe fallback
    return <div>Missing Workspace ID</div>;
  }

  // 1. Server-side fetch
  // Note: We type the response as 'any' briefly to handle the backend's { items: ... } shape
  // without duplicating the Paginated interface here.
  const result = await serverFetch<any>("/publishing/library", {
    workspaceId,
  });

  let initialPosts: ScheduledPostResponse[] = [];

  if (result.success) {
    // Unwrap the data server-side so the client gets a clean array
    initialPosts = result.data?.items || [];
  } else {
    console.error("Failed to fetch calendar posts server-side:", result.error);
    // We pass empty array so the UI renders (and allows client-side refetch)
  }

  // 2. Pass data to Client Component
  return (
    <CalendarClient workspaceId={workspaceId} initialPosts={initialPosts} />
  );
}
