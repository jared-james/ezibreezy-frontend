// components/calendar/hooks/use-delete-post.ts

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePost } from "@/lib/api/publishing";

export function useDeletePost() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post successfully deleted.");
      queryClient.invalidateQueries({ queryKey: ["contentLibrary"] });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(
        `Failed to delete post: ${
          error?.response?.data?.message || "Please try again."
        }`
      );
    },
  });

  const handleDeletePost = async (postId: string) => {
    return deleteMutation.mutateAsync(postId);
  };

  return {
    handleDeletePost,
    deletePostAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
