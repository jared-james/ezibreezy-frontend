// components/calendar/hooks/use-calendar-data.ts

"use client";

import { useMemo, useEffect } from "react";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  startOfMonth,
  endOfMonth,
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
  activeView?: CalendarView; // Kept in props if needed later, but removed from fetch logic
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

  // === CHANGE 1: Unified Date Range Calculation ===
  // Regardless of View (Month/Week/List), we always fetch the full visual month grid.
  // This allows us to switch views without changing the dataset.
  const dateRange = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // Expand to cover the full visual grid (Sunday start - Saturday end)
    const gridStart = subDays(monthStart, getDay(monthStart));
    const gridEnd = addDays(monthEnd, 6 - getDay(monthEnd));

    return {
      start: gridStart.toISOString(),
      end: gridEnd.toISOString(),
    };
  }, [currentDate]); // Removed activeView from dependency

  const {
    data: allContent = [],
    isLoading: isLoadingList,
    isFetching: isFetchingList,
    isError: isErrorList,
    error: errorList,
    refetch,
  } = useQuery<ScheduledPost[]>({
    // === CHANGE 2: Stable Query Key ===
    // Removed 'activeView' from the key.
    queryKey: [
      "contentLibrary",
      workspaceId,
      // Key now depends ONLY on the grid range, not the view type
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

  // === CHANGE 3: Update Prefetch Logic ===
  // Ensure prefetching also uses the simplified key structure
  useEffect(() => {
    const prefetchAdjacentMonth = (monthOffset: number) => {
      const targetDate =
        monthOffset > 0
          ? addMonths(currentDate, monthOffset)
          : subMonths(currentDate, Math.abs(monthOffset));
      const monthStart = startOfMonth(targetDate);
      const monthEnd = endOfMonth(targetDate);
      const gridStart = subDays(monthStart, getDay(monthStart));
      const gridEnd = addDays(monthEnd, 6 - getDay(monthEnd));

      const queryKey = [
        "contentLibrary",
        workspaceId,
        // Match the main query key structure exactly
        gridStart.toISOString(),
        gridEnd.toISOString(),
      ];

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

    prefetchAdjacentMonth(-1);
    prefetchAdjacentMonth(1);
  }, [currentDate, workspaceId, queryClient]); // Removed activeView dep

  // Background Fetch logic for Details (Unchanged)
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
