// components/calendar/components/calendar-post-card.tsx

"use client";

import { format } from "date-fns";
import { Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduledPost } from "../types";
import PlatformIcon from "./platform-icon";
import { useClientData } from "@/lib/hooks/use-client-data";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getPostDetailsAction } from "@/app/actions/publishing";

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
  const { userId } = useClientData();
  const queryClient = useQueryClient();
  const params = useParams();
  const workspaceId = params.workspace as string;

  const isCompact = variant === "compact";
  const isList = variant === "list";

  // Status flags
  const isSent = post.status === "sent";
  const isDraft = post.status === "draft";
  const isFailed = post.status === "failed";
  const isPendingApproval = post.status === "pending_approval";
  const isRejected = post.status === "rejected";

  // Approval Logic
  const amIRequested = userId && post.requestedApproverIds?.includes(userId);
  const haveIApproved = userId && post.approvedByIds?.includes(userId);
  const waitingOnMe = isPendingApproval && amIRequested && !haveIApproved;

  // Resolve media URL (prefer thumbnail, fallback to raw URL)
  const firstMedia = post.media?.[0];
  const mediaUrl = firstMedia?.thumbnailUrl || firstMedia?.url;

  // === PREFETCH ON HOVER ===
  const handleMouseEnter = () => {
    if (disabled || !post.id || !workspaceId) return;

    // Prefetch the full details so they are ready when the user clicks.
    // This runs in parallel with the user's reaction time.
    queryClient.prefetchQuery({
      queryKey: ["fullPostDetails", post.id, workspaceId],
      queryFn: async () => {
        const result = await getPostDetailsAction(post.id, workspaceId);
        if (!result.success) throw new Error(result.error);
        return result.data!;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={cn(
        "group/item relative flex w-full items-center gap-2 rounded-sm border bg-white text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98]",

        // Base Layout & Spacing
        isCompact ? "p-1.5 text-xs" : isList ? "p-3 text-sm" : "p-2 text-sm",
        disabled ? "cursor-default opacity-70" : "cursor-pointer",

        // Border Colors based on Status
        isFailed
          ? "border-error/50 bg-error/5 hover:border-error"
          : waitingOnMe
          ? "border-amber-400 bg-amber-50/50 hover:border-amber-500 ring-1 ring-amber-400/20"
          : isPendingApproval
          ? "border-blue-200 bg-blue-50/30 hover:border-blue-300"
          : isRejected
          ? "border-red-200 bg-red-50/30 hover:border-red-300"
          : isDraft
          ? "border-border border-dashed bg-muted/20 hover:border-muted-foreground/50"
          : "border-border hover:border-brand-primary", // Scheduled/Default

        // Sent State
        isSent &&
          "opacity-75 bg-muted/30 border-muted-foreground/20 hover:border-muted-foreground/40"
      )}
      disabled={disabled}
    >
      {/* Platform Icon */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          isCompact ? "h-4 w-4" : "h-5 w-5",
          isFailed
            ? "bg-error/10 text-error"
            : waitingOnMe
            ? "bg-amber-100 text-amber-600"
            : "bg-muted/50"
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
              isFailed
                ? "text-error"
                : waitingOnMe
                ? "text-amber-600"
                : isSent
                ? "text-muted-foreground/70"
                : "text-muted-foreground"
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

      {/* Content & Status Indicators */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex flex-col min-w-0 flex-1">
          <span
            className={cn(
              "truncate font-medium leading-tight",
              isSent ? "text-muted-foreground" : "text-foreground",
              isList && "text-base"
            )}
          >
            {post.content || "Untitled Post"}
          </span>

          {/* Status Subtext for special states */}
          {!isCompact && (
            <div className="flex items-center gap-1.5 mt-0.5">
              {waitingOnMe ? (
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-600">
                  <AlertCircle className="w-2.5 h-2.5" />
                  Review Needed
                </span>
              ) : isPendingApproval ? (
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-blue-600">
                  <Clock className="w-2.5 h-2.5" />
                  Pending
                </span>
              ) : isRejected ? (
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-600">
                  <AlertCircle className="w-2.5 h-2.5" />
                  Changes Requested
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Time */}
        {showTime && (
          <span
            className={cn(
              "ml-auto font-serif font-bold text-muted-foreground shrink-0 self-start",
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
