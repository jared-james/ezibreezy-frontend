// app/(app)/calendar/page.tsx

import CalendarClient from "./calendar-client";

// Force dynamic rendering - CRITICAL: avoid stale scheduling state
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ workspaceId?: string }>;
}

export default async function CalendarPage({ searchParams }: PageProps) {
  // Extract workspaceId from URL (guaranteed by proxy)
  const params = await searchParams;
  const workspaceId = params.workspaceId!;

  // For future: Fetch calendar events and scheduled posts server-side
  // const eventsResult = await serverFetch('/calendar/events', { workspaceId });
  // const scheduledResult = await serverFetch('/posts/scheduled', { workspaceId });

  return <CalendarClient workspaceId={workspaceId} />;
}
