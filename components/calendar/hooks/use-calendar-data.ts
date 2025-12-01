// components/calendar/hooks/use-calendar-data.ts

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getContentLibrary,
  getPostDetails,
  FullPostDetails,
} from "@/lib/api/publishing";
import type { ScheduledPost, CalendarFilters } from "../types";

interface UseCalendarDataProps {
  postIdToEdit: string | null;
  filters?: CalendarFilters;
}

export function useCalendarData({
  postIdToEdit,
  filters,
}: UseCalendarDataProps) {
  const {
    data: allContent = [],
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
    refetch,
  } = useQuery<ScheduledPost[]>({
    queryKey: ["contentLibrary"],
    queryFn: getContentLibrary,
    staleTime: 60000,
  });

  const filteredPosts = useMemo(() => {
    if (!filters) return allContent;

    return allContent.filter((post) => {
      // 1. Status Filter
      if (filters.status !== "all" && post.status !== filters.status) {
        return false;
      }

      if (
        filters.status === "all" &&
        (post.status === "cancelled" || post.status === "failed")
      ) {
        return false;
      }

      // 2. Channel Filter
      if (filters.channel !== "all" && post.platform !== filters.channel) {
        return false;
      }

      // 3. Label Filter
      if (filters.label !== "all") {
        const hasLabel = post.labels?.includes(filters.label);
        if (!hasLabel) return false;
      }

      return true;
    });
  }, [allContent, filters]);

  // Background Fetch logic
  // We fetch details if a post is selected, regardless of status.
  // This allows "Reuse" to eventually hydrate with full details even for sent posts.
  const {
    data: fullPostData,
    isLoading: isLoadingFullPost,
    isError: isErrorFullPost,
    error: errorFullPost,
    isFetching: isFetchingFullPost,
  } = useQuery<FullPostDetails>({
    queryKey: ["fullPostDetails", postIdToEdit],
    queryFn: () => getPostDetails(postIdToEdit!),
    enabled: !!postIdToEdit,
    staleTime: 5 * 60 * 1000, // Cache details for 5 mins
  });

  return {
    allContent,
    scheduledPosts: filteredPosts,
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
    refetch,

    fullPostData,
    isLoadingFullPost,
    isErrorFullPost,
    errorFullPost,
    isFetchingFullPost,
  };
}
