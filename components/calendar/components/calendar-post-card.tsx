// components/calendar/components/calendar-post-card.tsx

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

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/item relative flex w-full items-center gap-2 rounded-sm border border-border bg-white text-left shadow-sm transition-all hover:border-brand-primary hover:shadow-md active:scale-[0.98]",
        disabled
          ? "cursor-default opacity-70"
          : "cursor-pointer",
        post.status === "sent" && "cursor-not-allowed opacity-60 bg-muted/30",
        isCompact ? "p-1.5 text-xs" : isList ? "p-3 text-sm" : "p-2 text-sm"
      )}
      disabled={post.status === "sent" || disabled}
    >
      <div className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-muted/50",
        isCompact ? "h-4 w-4" : "h-5 w-5"
      )}>
        {disabled ? (
          <Loader2 className={cn(
            "animate-spin text-brand-primary",
            isCompact ? "h-2.5 w-2.5" : "h-3 w-3"
          )} />
        ) : (
          <PlatformIcon
            platform={post.platform}
            className="text-muted-foreground"
            size={isCompact ? 10 : 12}
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className={cn(
          "truncate font-medium text-foreground leading-tight",
          isList && "text-base"
        )}>
          {post.content || "Untitled Post"}
        </span>
        {showTime && (
          <span className={cn(
            "ml-auto font-serif font-bold text-muted-foreground shrink-0",
            isCompact ? "text-[9px]" : "text-[10px]"
          )}>
            {format(new Date(post.scheduledAt), isCompact ? "h:mma" : "h:mm a")}
          </span>
        )}
      </div>
    </button>
  );
}
