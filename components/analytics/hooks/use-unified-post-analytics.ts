// components/analytics/hooks/use-unified-post-analytics.ts

import { useEffect } from "react";
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

  // --- DEBUGGING START ---
  useEffect(() => {
    if (data) {
      console.group("📱 [Frontend] Unified Post Analytics");
      const flatPosts = data.pages.flatMap((page) => page.data);
      console.log(`Fetched ${flatPosts.length} posts total.`);

      if (flatPosts.length > 0) {
        const sample = flatPosts[0];
        console.log("Sample Post Structure:", sample);
        console.log("Sample Post Metrics (JSON):", sample.metrics);
        console.log(
          "Mapped Impressions (should match views if available):",
          sample.impressions
        );
      } else {
        console.log("No posts returned from backend.");
      }
      console.groupEnd();
    }
    if (error) {
      console.error("❌ [Frontend] Post Analytics Error:", error);
    }
  }, [data, error]);
  // --- DEBUGGING END ---

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
