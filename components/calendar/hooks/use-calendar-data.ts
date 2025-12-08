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

  const dateRange = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    const gridStart = subDays(monthStart, getDay(monthStart));
    const gridEnd = addDays(monthEnd, 6 - getDay(monthEnd));

    return {
      start: gridStart.toISOString(),
      end: gridEnd.toISOString(),
    };
  }, [currentDate]);

  const {
    data: allContent = [],
    isLoading: isLoadingList,
    isFetching: isFetchingList,
    isError: isErrorList,
    error: errorList,
    refetch,
  } = useQuery<ScheduledPost[]>({
    queryKey: ["contentLibrary", workspaceId, dateRange.start, dateRange.end],
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
        if (filters.status !== "all" && post.status !== filters.status)
          return false;
        if (
          filters.status === "all" &&
          (post.status === "cancelled" || post.status === "failed")
        )
          return false;
        if (filters.channel !== "all" && post.platform !== filters.channel)
          return false;
        if (filters.label !== "all") {
          const hasLabel = post.labels?.includes(filters.label);
          if (!hasLabel) return false;
        }
        return true;
      });
    }
    return posts;
  }, [allContent, filters]);

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
  }, [currentDate, workspaceId, queryClient]);

  // === SMART SKIP LOGIC ===
  const cachedPost = useMemo(() => {
    return allContent.find((p) => p.id === postIdToEdit);
  }, [allContent, postIdToEdit]);

  // We fetch details ONLY if:
  // 1. We have an ID
  // 2. AND we either don't have it in cache (deep link) OR it has threads (missing content)
  // If it's a simple post, we skip the fetch entirely because `populateStoreFromSummary` handles it.
  const shouldFetchDetails =
    !!postIdToEdit && (!cachedPost || (cachedPost.threadSize || 0) > 0);

  const {
    data: fullPostData,
    isLoading: isLoadingFullPost,
    isError: isErrorFullPost,
    error: errorFullPost,
    isFetching: isFetchingFullPost,
  } = useQuery<FullPostDetails>({
    queryKey: ["fullPostDetails", postIdToEdit, workspaceId],
    queryFn: async () => {
      console.log(
        `[Calendar Debug] 🚀 START fetching full details for post: ${postIdToEdit}`
      );
      const startTime = performance.now();

      const result = await getPostDetailsAction(postIdToEdit!, workspaceId);

      const duration = performance.now() - startTime;
      console.log(
        `[Calendar Debug] ✅ FINISHED fetching full details for post: ${postIdToEdit} (${duration.toFixed(
          2
        )}ms)`
      );

      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    enabled: shouldFetchDetails,
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
