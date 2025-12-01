// components/calendar/hooks/use-post-reschedule.ts

"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isSameDay, isBefore, parseISO, format } from "date-fns";
import { toast } from "sonner";
import {
  reschedulePostOnly,
  RescheduleOnlyPayload,
} from "@/lib/api/publishing";
import { useClientData } from "@/lib/hooks/use-client-data";
import type { ScheduledPost } from "../types";

export function usePostReschedule() {
  const [pendingReschedule, setPendingReschedule] = useState<{
    postId: string;
    payload: RescheduleOnlyPayload;
    originalTime: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const { userId } = useClientData();

  const rescheduleMutation = useMutation({
    mutationFn: (variables: {
      postId: string;
      payload: RescheduleOnlyPayload;
    }) => reschedulePostOnly(variables.postId, variables.payload),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["contentLibrary"] });

      const previousContent = queryClient.getQueryData<ScheduledPost[]>([
        "contentLibrary",
      ]);

      queryClient.setQueryData<ScheduledPost[]>(["contentLibrary"], (old) => {
        if (!old) return previousContent || [];

        return old.map((post) => {
          if (post.id === variables.postId) {
            return {
              ...post,
              scheduledAt: variables.payload.scheduledAt,
            };
          }
          return post;
        });
      });

      return { previousContent };
    },

    onSuccess: () => {
      toast.success("Post successfully rescheduled!");
    },

    onError: (error: Error, _variables, context) => {
      if (context?.previousContent) {
        queryClient.setQueryData(["contentLibrary"], context.previousContent);
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

      if (!userId) {
        toast.error("Authentication error: User ID not found.");
        return;
      }

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
    [rescheduleMutation.isPending, userId, executeReschedule]
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
