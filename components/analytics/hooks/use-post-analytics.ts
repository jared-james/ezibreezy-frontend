// components/analytics/hooks/use-post-analytics.ts

"use client";

import { useEffect } from "react";
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

  // --- DEBUGGING START ---
  useEffect(() => {
    if (data) {
      console.group("🎬 [YouTube] Post Analytics");
      const flatPosts = data.pages.flatMap((page) => page.data);
      console.log("Integration ID:", integrationId);
      console.log(`Total Posts Fetched: ${flatPosts.length}`);
      console.log("Raw Response Pages:", data.pages);

      if (flatPosts.length > 0) {
        const sample = flatPosts[0];
        console.log("Sample Post Structure:", sample);
        console.log("Sample Post Metrics:", sample.metrics);
        console.log("Sample Post - Views (impressions):", sample.impressions);
        console.log("Sample Post - Reach:", sample.reach);
        console.log("Sample Post - Likes:", sample.likes);
        console.log("Sample Post - Comments:", sample.comments);
        console.log("Sample Post - Shares:", sample.shares);
        console.log("Sample Post - Engagement Rate:", sample.engagementRate);
      } else {
        console.log("No posts returned from backend.");
      }

      // Log warnings from all pages
      const allWarnings = data.pages.flatMap((p) => p.warnings || []);
      if (allWarnings.length > 0) {
        console.log("Warnings:", allWarnings);
      }

      console.groupEnd();
    }
    if (error) {
      console.error("❌ [YouTube] Post Analytics Error:", error);
    }
  }, [data, error, integrationId]);
  // --- DEBUGGING END ---

  const posts = data?.pages.flatMap((p) => p.data) || [];

  // Collect warnings from all pages
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
