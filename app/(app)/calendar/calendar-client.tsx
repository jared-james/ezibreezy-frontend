// app/(app)/calendar/calendar-client.tsx

"use client";

import CalendarContainer from "@/components/calendar";

interface CalendarClientProps {
  workspaceId: string;
}

export default function CalendarClient({ workspaceId }: CalendarClientProps) {
  return <CalendarContainer />;
}
