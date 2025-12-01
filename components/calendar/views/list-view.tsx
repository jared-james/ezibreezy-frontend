// components/calendar/views/list-view.tsx

"use client";

import { useState } from "react";
import { Clock, Loader2, Trash2 } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import type { ScheduledPost } from "../types";
import { deletePost } from "@/lib/api/publishing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import PlatformIcon from "../components/platform-icon";

interface ListViewProps {
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
}

export default function ListView({ posts, onEditPost }: ListViewProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sortedPosts = [...posts].sort((a, b) => {
    return (
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onMutate: (postId) => {
      setDeletingId(postId);
    },
    onSuccess: () => {
      toast.success("Post successfully cancelled.");
      queryClient.invalidateQueries({ queryKey: ["contentLibrary"] });
      setDeletingId(null);
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(
        `Failed to cancel post: ${
          error?.response?.data?.message || "Please try again."
        }`
      );
      setDeletingId(null);
    },
  });

  const handleDelete = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (
      confirm("Are you sure you want to cancel and delete this scheduled post?")
    ) {
      deleteMutation.mutate(postId);
    }
  };

  if (sortedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-full bg-surface border border-border p-4 mb-4">
          <Clock className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="font-serif text-lg font-bold text-foreground">
          No Upcoming Posts
        </h3>
        <p className="font-serif text-sm text-muted-foreground mt-1 max-w-xs">
          Your schedule is clear. Click &quot;Create Post&quot; to start
          planning your content.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-8 px-4">
      <div className="space-y-4">
        {sortedPosts.map((post) => {
          const postDate = new Date(post.scheduledAt);
          const isDeleting = deletingId === post.id;

          const dayName = format(postDate, "EEE");
          const dayNumber = format(postDate, "d");
          const monthName = format(postDate, "MMM");

          let dateLabel = format(postDate, "MMMM d, yyyy");
          if (isToday(postDate)) dateLabel = "Today";
          if (isTomorrow(postDate)) dateLabel = "Tomorrow";

          const firstMedia = post.media?.[0];
          const mediaUrl = firstMedia?.thumbnailUrl || firstMedia?.url;

          return (
            <div
              key={post.id}
              onClick={() => onEditPost(post)}
              className={cn(
                "group relative flex items-stretch gap-6 rounded-lg border border-border bg-white p-1 transition-all hover:border-brand-primary hover:shadow-md cursor-pointer",
                isDeleting && "opacity-50 pointer-events-none"
              )}
            >
              {/* Date Block */}
              <div className="flex w-24 shrink-0 flex-col items-center justify-center rounded-md bg-surface-hover/50 border-r border-border/50 py-4">
                <span className="eyebrow text-[10px] text-muted-foreground">
                  {monthName}
                </span>
                <span className="font-serif text-3xl font-bold text-foreground leading-none my-1">
                  {dayNumber}
                </span>
                <span className="font-serif text-sm text-muted-foreground">
                  {dayName}
                </span>
              </div>

              {/* Thumbnail */}
              {mediaUrl && (
                <div className="hidden sm:flex shrink-0 w-24 items-center justify-center bg-muted/20 my-1 rounded-md overflow-hidden border border-border/50">
                  <img
                    src={mediaUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Content Block */}
              <div className="flex flex-1 flex-col justify-center py-3 pr-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                      post.status === "sent"
                        ? "bg-muted text-muted-foreground border-border"
                        : "bg-brand-primary/5 text-brand-primary border-brand-primary/20"
                    )}
                  >
                    {post.status === "sent" ? "Published" : dateLabel} •{" "}
                    {format(postDate, "h:mm a")}
                  </span>
                </div>

                <h3
                  className={cn(
                    "font-serif text-lg font-medium text-foreground line-clamp-2 leading-snug",
                    !post.content && "italic text-muted-foreground"
                  )}
                >
                  {post.content || "Untitled Post"}
                </h3>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <PlatformIcon
                      platform={post.platform}
                      className="text-muted-foreground"
                      size={14}
                    />
                    <span className="font-medium">
                      @{post.platformUsername}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions - Visible on Hover */}
              <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100 flex gap-2">
                <button
                  onClick={(e) => handleDelete(e, post.id)}
                  className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-full transition-colors"
                  title="Cancel Post"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
