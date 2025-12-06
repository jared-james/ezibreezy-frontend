// app/(app)/[workspace]/calendar/page.tsx

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "@/lib/utils/get-query-client";
import CalendarClient from "./calendar-client";
import { serverFetch } from "@/lib/api/server-fetch";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ workspace: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CalendarPage({ params }: PageProps) {
  const { workspace: workspaceId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["contentLibrary"],
    queryFn: async () => {
      // We manually use serverFetch here to ensure headers/cookies are passed
      const result = await serverFetch<any>("/publishing/library", {
        workspaceId,
      });
      return result.success ? result.data?.items || [] : [];
    },
  });

  // 2. Dehydrate the state (serialize it)
  const dehydratedState = dehydrate(queryClient);

  // 3. Wrap Client Component in Boundary
  return (
    <HydrationBoundary state={dehydratedState}>
      <CalendarClient workspaceId={workspaceId} />
    </HydrationBoundary>
  );
}
