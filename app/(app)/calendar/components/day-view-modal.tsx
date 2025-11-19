// app/(app)/calendar/components/day-view-modal.tsx

"use client";

import { useMemo } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Loader2,
  Instagram,
  Linkedin,
  Twitter,
  Plus,
} from "lucide-react";
import { format, isToday } from "date-fns";
import { ScheduledPost } from "../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/lib/api/publishing";
import { toast } from "sonner";
import Link from "next/link";

interface DayViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
  onNewPost: (date: Date) => void;
}

const platformIcons: Record<string, React.ElementType> = {
  x: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

// Sub-component for a single post item in the modal
const PostItem = ({
  post,
  onEditPost,
}: {
  post: ScheduledPost;
  onEditPost: (post: ScheduledPost) => void;
}) => {
  const queryClient = useQueryClient();
  const Icon = platformIcons[post.platform] || Clock;
  const postDate = new Date(post.scheduledAt);

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post successfully cancelled.");
      queryClient.invalidateQueries({ queryKey: ["scheduledPosts"] });
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast.error(
        `Failed to cancel post: ${
          error?.response?.data?.message || "Please try again."
        }`
      );
    },
  });

  const handleDelete = (postId: string) => {
    if (
      post.status === "sent" &&
      !confirm(
        "This post has already been sent. Are you sure you want to remove it from your history?"
      )
    ) {
      return;
    }

    if (
      post.status !== "sent" &&
      !confirm(
        "Are you sure you want to cancel and delete this scheduled post?"
      )
    ) {
      return;
    }

    deleteMutation.mutate(postId);
  };

  const isDeleting = deleteMutation.isPending;
  const isSent = post.status === "sent";

  return (
    <div
      key={post.id}
      className="flex items-center justify-between gap-4 border border-[--border] bg-[--surface-hover] p-3 transition-colors hover:border-[--border-hover]"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex flex-col items-center">
          <Icon className="h-5 w-5 shrink-0 text-brand-primary" />
          <span className="text-[0.6rem] uppercase font-bold text-muted-foreground">
            {post.platform}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-[--foreground] line-clamp-1">
            {post.content}
          </h3>
          <div className="mt-0.5 flex items-center gap-4 text-xs text-[--muted-foreground]">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>{format(postDate, "h:mm a")}</span>
            </div>
            <span
              className={cn(
                "font-bold text-[0.65rem] uppercase tracking-wider",
                isSent ? "text-success" : "text-warning"
              )}
            >
              {isSent ? "Sent" : "Scheduled"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditPost(post)}
          disabled={isSent || isDeleting}
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
};

export default function DayViewModal({
  isOpen,
  onClose,
  date,
  posts,
  onEditPost,
  onNewPost,
}: DayViewModalProps) {
  const postsForDay = useMemo(() => {
    if (!date) return [];
    return posts
      .filter(
        (post) =>
          format(new Date(post.scheduledAt), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      )
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
  }, [date, posts]);

  if (!isOpen || !date) return null;

  const formattedDate = format(date, "EEEE, MMMM do, yyyy");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 backdrop-blur-sm">
      <div className="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden border-4 border-foreground bg-surface shadow-2xl">
        <div className="z-10 flex shrink-0 items-center justify-between border-b-4 border-double border-foreground bg-surface p-6">
          <div>
            <p className="eyebrow mb-1">Posts for</p>
            <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              {formattedDate}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-icon hover:bg-surface-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              {postsForDay.length} Items
            </h3>
            <Button
              variant="primary"
              size="sm"
              className="gap-2"
              onClick={() => {
                onClose(); // Close Day View Modal
                onNewPost(date); // Open Editorial Modal for new post on this date
              }}
            >
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>

          <div className="space-y-3">
            {postsForDay.length === 0 ? (
              <p className="py-8 text-center font-serif text-muted-foreground italic">
                No scheduled or sent posts for this day.
              </p>
            ) : (
              postsForDay.map((post) => (
                <PostItem key={post.id} post={post} onEditPost={onEditPost} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
