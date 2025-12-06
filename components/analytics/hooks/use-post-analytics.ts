// components/analytics/hooks/use-post-analytics.ts

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostAnalytics } from "@/lib/api/analytics";
import type {
  PostAnalytics,
  AnalyticsResponse,
  AnalyticsWarning,
} from "@/lib/types/analytics";

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
  } = useInfiniteQuery<AnalyticsResponse<PostAnalytics[]>>({
    queryKey: ["post-analytics", integrationId, limit],
    queryFn: ({ pageParam = 0 }) =>
      getPostAnalytics(integrationId!, limit, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < limit) return undefined;
      return allPages.flatMap((p) => p.data).length;
    },
    enabled: !!integrationId,
    staleTime: 5 * 60 * 1000,
  });

  const posts = data?.pages.flatMap((p) => p.data) || [];

  const warnings: AnalyticsWarning[] =
    data?.pages.flatMap((p) => p.warnings || []) || [];

  const topPosts = [...posts]
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 3);

  return {
    posts,
    topPosts,
    warnings,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
