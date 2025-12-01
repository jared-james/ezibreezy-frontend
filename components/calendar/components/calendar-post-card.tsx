"use client";

import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduledPost } from "../types";
import PlatformIcon from "./platform-icon";

interface CalendarPostCardProps {
  post: ScheduledPost;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "compact" | "list";
  showTime?: boolean;
}

export default function CalendarPostCard({
  post,
  onClick,
  disabled = false,
  variant = "default",
  showTime = true,
}: CalendarPostCardProps) {
  const isCompact = variant === "compact";
  const isList = variant === "list";
  const isSent = post.status === "sent";

  // Resolve media URL (prefer thumbnail, fallback to raw URL)
  const firstMedia = post.media?.[0];
  const mediaUrl = firstMedia?.thumbnailUrl || firstMedia?.url;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/item relative flex w-full items-center gap-2 rounded-sm border border-border bg-white text-left shadow-sm transition-all hover:border-brand-primary hover:shadow-md active:scale-[0.98]",
        disabled ? "cursor-default opacity-70" : "cursor-pointer",
        // Visual distinction for sent posts, but NOT cursor-not-allowed
        isSent &&
          "opacity-75 bg-muted/30 border-muted-foreground/20 hover:border-muted-foreground/40",
        isCompact ? "p-1.5 text-xs" : isList ? "p-3 text-sm" : "p-2 text-sm"
      )}
      // Only disable if explicitly told to (e.g. during loading), NOT because it's sent
      disabled={disabled}
    >
      {/* Platform Icon */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-muted/50",
          isCompact ? "h-4 w-4" : "h-5 w-5"
        )}
      >
        {disabled ? (
          <Loader2
            className={cn(
              "animate-spin text-brand-primary",
              isCompact ? "h-2.5 w-2.5" : "h-3 w-3"
            )}
          />
        ) : (
          <PlatformIcon
            platform={post.platform}
            className={cn(
              isSent ? "text-muted-foreground/70" : "text-muted-foreground"
            )}
            size={isCompact ? 10 : 12}
          />
        )}
      </div>

      {/* Thumbnail Image */}
      {mediaUrl && (
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-sm bg-muted border border-border/50",
            isSent && "opacity-80 grayscale-[0.2]",
            isCompact ? "h-4 w-4" : isList ? "h-10 w-10" : "h-5 w-5"
          )}
        >
          <img
            src={mediaUrl}
            alt="Post preview"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content & Time */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className={cn(
            "truncate font-medium text-foreground leading-tight",
            isSent && "text-muted-foreground",
            isList && "text-base"
          )}
        >
          {post.content || "Untitled Post"}
        </span>
        {showTime && (
          <span
            className={cn(
              "ml-auto font-serif font-bold text-muted-foreground shrink-0",
              isCompact ? "text-[9px]" : "text-[10px]"
            )}
          >
            {format(new Date(post.scheduledAt), isCompact ? "h:mma" : "h:mm a")}
          </span>
        )}
      </div>
    </button>
  );
}
