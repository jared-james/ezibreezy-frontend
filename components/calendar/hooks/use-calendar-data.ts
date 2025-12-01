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
  filters?: CalendarFilters; // Optional filters to process data
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

  // Filter logic moved here (or can remain in the parent, but clean to do here)
  const filteredPosts = useMemo(() => {
    if (!filters) return allContent;

    return allContent.filter((post) => {
      // 1. Status Filter
      // specific logic: 'all' usually excludes cancelled/failed unless specifically asked,
      // but for this request, let's map the UI status to data status.
      if (filters.status !== "all" && post.status !== filters.status) {
        return false;
      }
      // If status is 'all', we usually still hide 'cancelled' or 'failed' to keep calendar clean,
      // unless you want a specific 'Trash' view. Let's hide cancelled by default.
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
    staleTime: 0,
  });

  return {
    // All posts (raw)
    allContent,
    // Filtered posts for view
    scheduledPosts: filteredPosts,

    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
    refetch,

    // Full post details (for editing)
    fullPostData,
    isLoadingFullPost,
    isErrorFullPost,
    errorFullPost,
    isFetchingFullPost,
  };
}
