"use client";

import { Twitter, Instagram, Linkedin, Clock, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { ScheduledPost } from "../types";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/api/publishing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

interface ListViewProps {
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
}

const platformIcons: Record<string, React.ElementType> = {
  x: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

export default function ListView({ posts, onEditPost }: ListViewProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onMutate: (postId) => {
      setDeletingId(postId);
      toast.info(`Cancelling post ${postId}...`);
    },
    onSuccess: (_, postId) => {
      toast.success("Post successfully cancelled.");
      queryClient.invalidateQueries({ queryKey: ["scheduledPosts"] });
      setDeletingId(null);
    },
    onError: (error: any, postId) => {
      toast.error(
        `Failed to cancel post ${postId}: ${
          error?.response?.data?.message || "Please try again."
        }`
      );
      setDeletingId(null);
    },
  });

  const handleDelete = (postId: string) => {
    if (confirm("Cancel and delete this scheduled post?")) {
      deleteMutation.mutate(postId);
    }
  };

  return (
    <div className="border border-border bg-surface p-6">
      <div className="mx-auto max-w-4xl">
        {posts.length === 0 ? (
          <p className="py-8 text-center font-serif text-muted-foreground">
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
                  className="flex items-center gap-4 border border-border bg-surface-hover p-4 transition-colors hover:border-border-hover"
                >
                  <div className="flex flex-col items-center">
                    <span className="font-serif text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      {format(postDate, "MMM")}
                    </span>
                    <span className="font-serif text-3xl font-bold text-foreground">
                      {format(postDate, "dd")}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="line-clamp-1 font-serif font-bold text-foreground">
                      {post.content}
                    </h3>

                    <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPost(post)}
                    >
                      Edit
                    </Button>

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
