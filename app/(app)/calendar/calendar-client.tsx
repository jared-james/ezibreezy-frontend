// app/(app)/calendar/calendar-client.tsx

"use client";

import CalendarContainer from "@/components/calendar";
import type { ScheduledPost } from "@/components/calendar/types";

interface CalendarClientProps {
  workspaceId: string;
  initialPosts: ScheduledPost[]; // Matches ScheduledPostResponse
}

export default function CalendarClient({
  workspaceId,
  initialPosts,
}: CalendarClientProps) {
  return <CalendarContainer initialPosts={initialPosts} />;
}
