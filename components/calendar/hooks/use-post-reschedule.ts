// components/calendar/hooks/use-post-reschedule.ts

"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isSameDay, isBefore, parseISO, format } from "date-fns";
import { toast } from "sonner";
import type { RescheduleOnlyPayload } from "@/lib/types/publishing";
import { reschedulePostOnlyAction } from "@/app/actions/publishing";
import { useClientData } from "@/lib/hooks/use-client-data";
import type { ScheduledPost } from "../types";

export function usePostReschedule() {
  const [pendingReschedule, setPendingReschedule] = useState<{
    postId: string;
    payload: RescheduleOnlyPayload;
    originalTime: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const { workspaceId } = useClientData();

  const rescheduleMutation = useMutation({
    mutationFn: async (variables: {
      postId: string;
      payload: RescheduleOnlyPayload;
    }) => {
      if (!workspaceId) throw new Error("Workspace ID missing");
      const result = await reschedulePostOnlyAction(
        variables.postId,
        variables.payload,
        workspaceId
      );
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to reschedule post");
      }
      return result.data;
    },

    onMutate: async (variables) => {
      // Cancel all contentLibrary queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ["contentLibrary"] });

      // Store previous data from all matching queries for rollback
      const previousQueries: Array<{
        queryKey: unknown[];
        data: ScheduledPost[];
      }> = [];

      // Update all contentLibrary queries optimistically
      queryClient.setQueriesData<ScheduledPost[]>(
        { queryKey: ["contentLibrary"] },
        (old) => {
          if (!old) return old;

          // Store the previous data for potential rollback
          previousQueries.push({
            queryKey: ["contentLibrary"],
            data: old,
          });

          // Return updated data with the rescheduled post
          return old.map((post) => {
            if (post.id === variables.postId) {
              return {
                ...post,
                scheduledAt: variables.payload.scheduledAt,
              };
            }
            return post;
          });
        }
      );

      return { previousQueries };
    },

    onSuccess: () => {
      // Invalidate all contentLibrary queries to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ["contentLibrary"] });
      toast.success("Post successfully rescheduled!");
    },

    onError: (error: Error, _variables, context) => {
      // Rollback optimistic updates on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(`Rescheduling failed: ${error.message}`);
    },
  });

  const lockedPostId = rescheduleMutation.isPending
    ? rescheduleMutation.variables?.postId
    : pendingReschedule?.postId;

  const executeReschedule = useCallback(
    async (postId: string, payload: RescheduleOnlyPayload) => {
      try {
        await rescheduleMutation.mutateAsync({ postId, payload });
        setPendingReschedule(null);
      } catch {
        // Error is already handled by mutation onError
      }
    },
    [rescheduleMutation]
  );

  const handleDropPost = useCallback(
    async (postId: string, newDate: Date, allContent: ScheduledPost[]) => {
      if (rescheduleMutation.isPending) return;

      const originalPost = allContent.find((p) => p.id === postId);

      if (!originalPost || originalPost.status === "sent") {
        toast.info(
          originalPost?.status === "sent"
            ? "Cannot move a sent post."
            : "Post data missing. Cannot move."
        );
        return;
      }

      if (isSameDay(new Date(originalPost.scheduledAt), newDate)) {
        return;
      }

      let newScheduledTimeStr: string;

      if (originalPost.scheduledAt) {
        const originalDateTime = parseISO(originalPost.scheduledAt);
        const updatedDateTime = new Date(newDate);

        updatedDateTime.setHours(
          originalDateTime.getHours(),
          originalDateTime.getMinutes(),
          originalDateTime.getSeconds(),
          originalDateTime.getMilliseconds()
        );

        if (isBefore(updatedDateTime, new Date())) {
          setPendingReschedule({
            postId,
            originalTime: format(originalDateTime, "h:mm a"),
            payload: { scheduledAt: updatedDateTime.toISOString() },
          });
          return;
        }

        newScheduledTimeStr = updatedDateTime.toISOString();
      } else {
        const fallbackDateTime = new Date(newDate);
        fallbackDateTime.setHours(12, 0, 0, 0);
        newScheduledTimeStr = fallbackDateTime.toISOString();
      }

      const payload: RescheduleOnlyPayload = {
        scheduledAt: newScheduledTimeStr,
      };

      await executeReschedule(postId, payload);
    },
    [rescheduleMutation.isPending, executeReschedule]
  );

  const confirmPendingReschedule = useCallback(() => {
    if (pendingReschedule) {
      executeReschedule(pendingReschedule.postId, pendingReschedule.payload);
    }
  }, [pendingReschedule, executeReschedule]);

  const cancelPendingReschedule = useCallback(() => {
    setPendingReschedule(null);
  }, []);

  return {
    // State
    pendingReschedule,
    lockedPostId,

    // Actions
    handleDropPost,
    executeReschedule,
    confirmPendingReschedule,
    cancelPendingReschedule,

    // Mutation
    isRescheduling: rescheduleMutation.isPending,
  };
}
