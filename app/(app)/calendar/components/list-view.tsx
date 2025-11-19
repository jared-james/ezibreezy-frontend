// app/(app)/calendar/components/list-view.tsx

"use client";

import { Twitter, Instagram, Linkedin, Clock, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { ScheduledPost } from "../types";
import Link from "next/link"; // KEEP: for now, for consistency with the link in the button
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/api/publishing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

interface ListViewProps {
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void; // NEW PROP
}

const platformIcons: Record<string, React.ElementType> = {
  x: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

export default function ListView({ posts, onEditPost }: ListViewProps) {
  // ACCEPT NEW PROP
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // NEW: Mutation for deleting a post
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onMutate: (postId) => {
      setDeletingId(postId);
      toast.info(`Cancelling post ${postId}...`);
    },
    onSuccess: (_, postId) => {
      toast.success("Post successfully cancelled.");
      // Invalidate the cache to trigger a refetch in CalendarPage
      queryClient.invalidateQueries({ queryKey: ["scheduledPosts"] });
      setDeletingId(null);
    },
    onError: (error: any, postId) => {
      console.error("Delete error:", error);
      toast.error(
        `Failed to cancel post ${postId}: ${
          error?.response?.data?.message || "Please try again."
        }`
      );
      setDeletingId(null);
    },
  });

  const handleDelete = (postId: string) => {
    if (
      confirm("Are you sure you want to cancel and delete this scheduled post?")
    ) {
      deleteMutation.mutate(postId);
    }
  };

  return (
    <div className="border border-[--border] bg-[--surface] p-6">
      <div className="mx-auto max-w-4xl">
        {posts.length === 0 ? (
          <p className="py-8 text-center font-serif text-[--muted-foreground]">
            No posts scheduled for this period.
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const Icon = platformIcons[post.platform] || Clock;
              const postDate = new Date(post.scheduledAt);
              const isDeleting = deletingId === post.id;

              return (
                <div
                  key={post.id}
                  className="flex items-center gap-4 border border-[--border] bg-[--surface-hover] p-4 transition-colors hover:border-[--border-hover]"
                >
                  <div className="flex flex-col items-center">
                    <span className="font-serif text-sm font-bold uppercase tracking-wider text-[--muted-foreground]">
                      {format(postDate, "MMM")}
                    </span>
                    <span className="font-serif text-3xl font-bold text-[--foreground]">
                      {format(postDate, "dd")}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-[--foreground] line-clamp-1">
                      {post.content}
                    </h3>
                    <div className="mt-1 flex items-center gap-4 text-xs text-[--muted-foreground]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>{format(postDate, "h:mm a")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-brand-primary" />
                        <span className="font-medium">
                          @{post.platformUsername}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* MODIFIED: Changed from <Link> to a <Button> that calls onEditPost */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPost(post)}
                    >
                      Edit
                    </Button>
                    {/* END MODIFIED */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-2 text-error hover:bg-error/10"
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
