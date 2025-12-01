// components/calendar/hooks/use-calendar-data.ts

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContentLibrary, getPostDetails, FullPostDetails } from "@/lib/api/publishing";
import type { ScheduledPost } from "../types";

interface UseCalendarDataProps {
  postIdToEdit: string | null;
}

export function useCalendarData({ postIdToEdit }: UseCalendarDataProps) {
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

  const scheduledPosts = useMemo(() => {
    return allContent.filter(
      (post) =>
        post.status !== "draft" &&
        post.status !== "failed" &&
        post.status !== "cancelled"
    );
  }, [allContent]);

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
    // All posts
    allContent,
    scheduledPosts,
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
