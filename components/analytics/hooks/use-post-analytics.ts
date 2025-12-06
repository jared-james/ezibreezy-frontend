// components/analytics/hooks/use-post-analytics.ts

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostAnalyticsAction } from "@/app/actions/analytics";
import { useParams } from "next/navigation";
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
  const params = useParams();
  const workspaceId = params.workspace as string;

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<AnalyticsResponse<PostAnalytics[]>>({
    queryKey: ["post-analytics", integrationId, limit, workspaceId],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getPostAnalyticsAction(
        integrationId!,
        limit,
        pageParam as number,
        workspaceId
      );
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch post analytics");
      }
      return result.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length < limit) return undefined;
      return allPages.flatMap((p) => p.data).length;
    },
    enabled: !!integrationId && !!workspaceId,
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
