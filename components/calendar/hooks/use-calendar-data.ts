// components/calendar/hooks/use-calendar-data.ts

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FullPostDetails } from "@/lib/api/publishing";
import {
  getContentLibraryAction,
  getPostDetailsAction,
} from "@/app/actions/publishing";
import type { ScheduledPost, CalendarFilters, CalendarView } from "../types";

interface UseCalendarDataProps {
  postIdToEdit: string | null;
  filters?: CalendarFilters;
  activeView?: CalendarView;
  currentDate?: Date;
}

export function useCalendarData({
  postIdToEdit,
  filters,
  activeView,
  currentDate,
}: UseCalendarDataProps) {
  const params = useParams();
  const workspaceId = params.workspace as string;

  const {
    data: allContent = [],
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
    refetch,
  } = useQuery<ScheduledPost[]>({
    queryKey: ["contentLibrary", workspaceId],
    queryFn: async () => {
      const result = await getContentLibraryAction(workspaceId);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    // === ADD HYDRATION CONFIG ===
    staleTime: 60000,
  });

  const filteredPosts = useMemo(() => {
    // Ensure allContent is always an array
    let posts = Array.isArray(allContent) ? allContent : [];

    // Apply filter-based filtering
    if (filters) {
      posts = posts.filter((post) => {
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
    }

    // Apply date filtering for List view
    if (activeView === "List" && currentDate) {
      const targetMonth = currentDate.getMonth();
      const targetYear = currentDate.getFullYear();

      posts = posts.filter((post) => {
        const postDate = new Date(post.scheduledAt);
        return (
          postDate.getMonth() === targetMonth &&
          postDate.getFullYear() === targetYear
        );
      });
    }

    return posts;
  }, [allContent, filters, activeView, currentDate]);

  // Background Fetch logic
  const {
    data: fullPostData,
    isLoading: isLoadingFullPost,
    isError: isErrorFullPost,
    error: errorFullPost,
    isFetching: isFetchingFullPost,
  } = useQuery<FullPostDetails>({
    queryKey: ["fullPostDetails", postIdToEdit, workspaceId],
    queryFn: async () => {
      const result = await getPostDetailsAction(postIdToEdit!, workspaceId);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!postIdToEdit,
    staleTime: 5 * 60 * 1000,
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
