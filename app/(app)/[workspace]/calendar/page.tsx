// app/(app)/[workspace]/calendar/page.tsx

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/utils/get-query-client";
import CalendarClient from "./calendar-client";
import { serverFetch } from "@/lib/api/server-fetch";
import { startOfMonth, endOfMonth, subDays, addDays, getDay } from "date-fns";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CalendarPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  const queryClient = getQueryClient();

  // Calculate default view range (Current Month) to prefetch
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Match the grid logic: start of week for the 1st, end of week for the last
  const gridStart = subDays(monthStart, getDay(monthStart));
  const gridEnd = addDays(monthEnd, 6 - getDay(monthEnd));

  const startStr = gridStart.toISOString();
  const endStr = gridEnd.toISOString();

  await queryClient.prefetchQuery({
    // Key must match exactly what useCalendarData generates for the default view
    queryKey: ["contentLibrary", workspaceId, "Month", startStr, endStr],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        startDate: startStr,
        endDate: endStr,
      }).toString();

      const result = await serverFetch<any>(
        `/publishing/library?${queryString}`,
        {
          workspaceId,
        }
      );
      return result.success ? result.data?.items || [] : [];
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CalendarClient workspaceId={workspaceId} />
    </HydrationBoundary>
  );
}
