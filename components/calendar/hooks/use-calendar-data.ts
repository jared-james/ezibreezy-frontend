// components/calendar/hooks/use-calendar-data.ts

"use client";

import { useMemo, useEffect } from "react";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subDays,
  addDays,
  getDay,
  addMonths,
  subMonths,
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
  const queryClient = useQueryClient();

  // Calculate Date Range for Fetching
  const dateRange = useMemo(() => {
    // For List view, we treat it like Month view for data fetching purposes
    // so pagination works within the context of the selected month
    if (activeView === "Month" || activeView === "List") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      // Expand to cover the full visual grid (start of week / end of week)
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
    isFetching: isFetchingList,
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
    // THIS FIXES THE UX FLASH: Keeps old data visible while fetching new data
    placeholderData: keepPreviousData,
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

  // Prefetch adjacent months for instant navigation
  useEffect(() => {
    if (activeView !== "Month" && activeView !== "List") return;

    const prefetchAdjacentMonth = (monthOffset: number) => {
      const targetDate = monthOffset > 0 ? addMonths(currentDate, monthOffset) : subMonths(currentDate, Math.abs(monthOffset));
      const monthStart = startOfMonth(targetDate);
      const monthEnd = endOfMonth(targetDate);
      const gridStart = subDays(monthStart, getDay(monthStart));
      const gridEnd = addDays(monthEnd, 6 - getDay(monthEnd));

      const queryKey = [
        "contentLibrary",
        workspaceId,
        activeView,
        gridStart.toISOString(),
        gridEnd.toISOString(),
      ];

      // Prefetch if not already cached
      queryClient.prefetchQuery({
        queryKey,
        queryFn: async () => {
          const result = await getContentLibraryAction(workspaceId, {
            startDate: gridStart.toISOString(),
            endDate: gridEnd.toISOString(),
          });
          if (!result.success) throw new Error(result.error);
          return result.data!;
        },
        staleTime: 60000,
      });
    };

    // Prefetch previous and next month
    prefetchAdjacentMonth(-1); // Previous month
    prefetchAdjacentMonth(1);  // Next month
  }, [currentDate, activeView, workspaceId, queryClient]);

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
    isFetching: isFetchingList,
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
