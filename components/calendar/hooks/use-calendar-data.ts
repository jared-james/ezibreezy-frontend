// components/calendar/hooks/use-calendar-data.ts

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subDays,
  addDays,
  getDay,
} from "date-fns";
import { FullPostDetails } from "@/lib/types/publishing";
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
  activeView = "Month",
  currentDate = new Date(),
}: UseCalendarDataProps) {
  const params = useParams();
  const workspaceId = params.workspace as string;

  // Calculate Date Range for Fetching
  const dateRange = useMemo(() => {
    // For List view, we treat it like Month view for data fetching purposes
    // so pagination works within the context of the selected month
    if (activeView === "Month" || activeView === "List") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      // Expand to cover the full visual grid (start of week / end of week)
      // This matches MonthView logic: start = subDays(monthStart, getDay(monthStart))
      // This ensures posts in the "grey" days of the previous/next month are loaded
      const gridStart = subDays(monthStart, getDay(monthStart));
      const gridEnd = addDays(monthEnd, 6 - getDay(monthEnd));

      return {
        start: gridStart.toISOString(),
        end: gridEnd.toISOString(),
      };
    }

    if (activeView === "Week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return {
        start: weekStart.toISOString(),
        end: weekEnd.toISOString(),
      };
    }

    // Fallback
    return {
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    };
  }, [activeView, currentDate]);

  const {
    data: allContent = [],
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
    refetch,
  } = useQuery<ScheduledPost[]>({
    // Include date range in query key to trigger refetch on navigation
    queryKey: [
      "contentLibrary",
      workspaceId,
      activeView,
      dateRange.start,
      dateRange.end,
    ],
    queryFn: async () => {
      const result = await getContentLibraryAction(workspaceId, {
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    staleTime: 60000,
  });

  const filteredPosts = useMemo(() => {
    let posts = Array.isArray(allContent) ? allContent : [];

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

    return posts;
  }, [allContent, filters]);

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
