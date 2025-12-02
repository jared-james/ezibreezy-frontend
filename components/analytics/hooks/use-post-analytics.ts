// components/analytics/hooks/use-post-analytics.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostAnalytics } from "@/lib/api/analytics";
import type { PostAnalytics } from "@/lib/types/analytics";

interface UsePostAnalyticsProps {
  integrationId: string | null;
  limit?: number;
}

interface UsePostAnalyticsReturn {
  posts: PostAnalytics[];
  topPosts: PostAnalytics[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

export function usePostAnalytics({
  integrationId,
  limit = 10,
}: UsePostAnalyticsProps): UsePostAnalyticsReturn {
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PostAnalytics[]>({
    queryKey: ["post-analytics", integrationId, limit],
    queryFn: () => getPostAnalytics(integrationId!, limit),
    enabled: !!integrationId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const topPosts = [...posts]
    .sort((a, b) => b.metrics.engagementRate - a.metrics.engagementRate)
    .slice(0, 3);

  return {
    posts,
    topPosts,
    isLoading,
    isError,
    error,
    refetch,
  };
}
