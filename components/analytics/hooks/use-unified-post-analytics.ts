// components/analytics/hooks/use-unified-post-analytics.ts

import { useQueries } from "@tanstack/react-query";
import { getPostAnalytics } from "@/lib/api/analytics";
import type { PostAnalytics, Account } from "@/lib/types/analytics";

interface UseUnifiedPostAnalyticsProps {
  accounts: Account[];
  limit?: number; // Items to fetch PER account
}

interface UnifiedPostData {
  posts: PostAnalytics[];
  topPosts: PostAnalytics[];
  isLoading: boolean;
  errors: Error[];
  // For the overview, we simplify pagination to "Load More Recent"
  // which fetches the next batch for ALL accounts simultaneously
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function useUnifiedPostAnalytics({
  accounts,
  limit = 10,
}: UseUnifiedPostAnalyticsProps): UnifiedPostData {
  // 1. Fetch posts from all accounts in parallel
  const queries = useQueries({
    queries: accounts.map((account) => ({
      queryKey: ["post-analytics", account.id, limit],
      queryFn: async () => {
        const response = await getPostAnalytics(account.id, limit, 0);
        // Tag the posts with platform info so UI knows which icon to show
        return response.data.map((post) => ({
          ...post,
          integrationId: account.id,
          platform: account.platform, // 'instagram' | 'youtube'
        }));
      },
      enabled: !!account.id && account.status !== "error",
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = queries.some(
    (q) => q.isLoading && q.fetchStatus !== "idle"
  );
  const errors = queries.map((q) => q.error).filter(Boolean) as Error[];

  // 2. Merge and Sort Results
  // We flatten the arrays from all successful queries
  const allPosts = queries
    .flatMap((q) => q.data || [])
    .sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );

  // 3. Calculate Top Performers (Global Engagement Rate)
  const topPosts = [...allPosts]
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 3); // Top 3

  // Note: For the "Overview", true infinite scrolling across multiple disjointed APIs
  // is complex. We currently fetch the 'limit' (e.g. 10) from EACH account.
  // With 2 accounts, that's 20 items. With 5 accounts, that's 50 items.
  // This is usually sufficient for a "Headquarters" snapshot.

  return {
    posts: allPosts,
    topPosts,
    isLoading,
    errors,
    // Stubs for pagination compatibility with ContentList component
    // In a future iteration, we can implement offset-based fetching for all queries
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
  };
}
