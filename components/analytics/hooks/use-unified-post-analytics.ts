// components/analytics/hooks/use-unified-post-analytics.ts

import { useInfiniteQuery } from "@tanstack/react-query";
import { getAggregatedPosts } from "@/lib/api/analytics";
import type { PostAnalytics, Account } from "@/lib/types/analytics";

interface UseUnifiedPostAnalyticsProps {
  accounts: Account[];
  limit?: number;
}

interface UnifiedPostData {
  posts: PostAnalytics[];
  topPosts: PostAnalytics[];
  isLoading: boolean;
  errors: Error[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function useUnifiedPostAnalytics({
  accounts,
  limit = 12,
}: UseUnifiedPostAnalyticsProps): UnifiedPostData {
  const integrationIds = accounts.map((a) => a.id);
  const isEnabled = integrationIds.length > 0;

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["aggregated-posts", integrationIds, limit],
    queryFn: ({ pageParam = 0 }) =>
      getAggregatedPosts(integrationIds, limit, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data || lastPage.data.length < limit) return undefined;
      return allPages.flatMap((p) => p.data).length;
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const posts = data?.pages.flatMap((p) => p.data) || [];

  const topPosts = [...posts]
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 3);

  return {
    posts,
    topPosts,
    isLoading,
    errors: isError && error ? [error as Error] : [],
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}
