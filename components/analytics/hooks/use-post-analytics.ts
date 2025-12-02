// components/analytics/hooks/use-post-analytics.ts

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostAnalytics } from "@/lib/api/analytics";
import type { PostAnalytics } from "@/lib/types/analytics";

interface UsePostAnalyticsProps {
  integrationId: string | null;
  limit?: number;
}

export function usePostAnalytics({
  integrationId,
  limit = 12,
}: UsePostAnalyticsProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["post-analytics", integrationId, limit],
    queryFn: ({ pageParam = 0 }) =>
      getPostAnalytics(integrationId!, limit, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.flat().length;
    },
    enabled: !!integrationId,
    staleTime: 5 * 60 * 1000,
  });

  const posts = data?.pages.flat() || [];

  const topPosts = [...posts]
    .sort((a, b) => b.metrics.engagementRate - a.metrics.engagementRate)
    .slice(0, 3);

  return {
    posts,
    topPosts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
