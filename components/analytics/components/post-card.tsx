// components/analytics/components/post-card.tsx

"use client";

import {
  ExternalLink,
  Heart,
  MessageCircle,
  Eye,
  BarChart3,
  Share2,
  Bookmark,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import type { PostAnalytics } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostAnalytics;
  rank?: number;
  layout?: "horizontal" | "vertical";
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncateCaption(caption: string, maxLength: number = 100): string {
  if (caption.length <= maxLength) return caption;
  return caption.substring(0, maxLength) + "...";
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PostCard({
  post,
  rank,
  layout = "horizontal",
}: PostCardProps) {
  const isVertical = layout === "vertical";

  // Updated: Read from top-level property
  const hasData = post.impressions > 0;

  // Check if this is a YouTube video with extended metrics
  const extendedMetrics = post.metrics || {};
  const isYouTube =
    extendedMetrics.watchTimeMinutes !== undefined ||
    extendedMetrics.avgViewDuration !== undefined;
  const hasYouTubeMetrics =
    isYouTube &&
    (extendedMetrics.avgViewDuration !== undefined ||
      extendedMetrics.avgViewPercentage !== undefined ||
      extendedMetrics.subscribersGained !== undefined);

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 p-4 border border-foreground/20 bg-background transition-all duration-200 hover:border-brand-primary hover:shadow-sm",
        !isVertical && "sm:flex-row"
      )}
    >
      <div
        className={cn(
          "relative shrink-0 aspect-square bg-muted border border-foreground/10 group-hover:border-brand-primary/50 transition-colors overflow-hidden",
          isVertical ? "w-full" : "w-full sm:w-28"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.thumbnailUrl}
          alt="Post thumbnail"
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />

        {rank && (
          <div className="absolute top-0 left-0 bg-brand-primary text-foreground font-mono text-xs font-bold px-2 py-1 shadow-sm z-10 border-b border-r border-black/10">
            #{rank}
          </div>
        )}

        <div className="absolute bottom-0 right-0 bg-background/90 text-foreground border-t border-l border-foreground/20 text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5">
          {post.type.replace("_", " ")}
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0 justify-between">
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              {formatDate(post.postedAt)}
            </span>
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-primary hover:text-brand-primary/80 hover:underline decoration-brand-primary/50 underline-offset-4 transition-all"
            >
              <span>View Post</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="font-serif text-sm text-foreground leading-relaxed line-clamp-2 border-l-2 border-brand-primary/30 group-hover:border-brand-primary pl-3 transition-colors">
            {truncateCaption(post.caption)}
          </p>
        </div>

        {/* Standard Metrics Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-3 border-t border-dashed border-foreground/10">
          {/* 1. Engagement Rate */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <BarChart3 className="h-3 w-3" />
            </div>
            <span
              className={cn(
                "font-mono text-xs font-bold",
                hasData && post.engagementRate >= 5
                  ? "text-brand-primary"
                  : "text-foreground"
              )}
            >
              {hasData ? `${post.engagementRate.toFixed(1)}%` : "—"}
            </span>
          </div>

          {/* 2. Likes */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <Heart className="h-3 w-3" />
            </div>
            <span className="font-mono text-xs font-medium text-foreground">
              {formatNumber(post.likes)}
            </span>
          </div>

          {/* 3. Comments */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <MessageCircle className="h-3 w-3" />
            </div>
            <span className="font-mono text-xs font-medium text-foreground">
              {formatNumber(post.comments)}
            </span>
          </div>

          {/* 4. Shares */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <Share2 className="h-3 w-3" />
            </div>
            <span className="font-mono text-xs font-medium text-foreground">
              {formatNumber(post.shares)}
            </span>
          </div>

          {/* 5. Saves (or Subscriber Net for YouTube) */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              {isYouTube ? (
                <Users className="h-3 w-3" />
              ) : (
                <Bookmark className="h-3 w-3" />
              )}
            </div>
            <span className="font-mono text-xs font-medium text-foreground">
              {isYouTube && extendedMetrics.subscribersNet !== undefined
                ? `${extendedMetrics.subscribersNet > 0 ? "+" : ""}${
                    extendedMetrics.subscribersNet
                  }`
                : formatNumber(post.saves)}
            </span>
          </div>

          {/* 6. Impressions/Views */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <Eye className="h-3 w-3" />
            </div>
            <span className="font-mono text-xs font-medium text-foreground">
              {formatNumber(post.impressions)}
            </span>
          </div>
        </div>

        {/* YouTube-Specific Extended Metrics */}
        {hasYouTubeMetrics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-dashed border-brand-primary/20 bg-brand-primary/5 -mx-4 -mb-4 px-4 pb-4">
            {/* Avg View Duration */}
            {extendedMetrics.avgViewDuration !== undefined &&
              extendedMetrics.avgViewDuration > 0 && (
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
                    <Clock className="h-3 w-3" />
                    <span>Duration</span>
                  </div>
                  <span className="font-mono text-xs font-medium text-foreground">
                    {formatDuration(extendedMetrics.avgViewDuration)}
                  </span>
                </div>
              )}

            {/* Avg View Percentage */}
            {extendedMetrics.avgViewPercentage !== undefined &&
              extendedMetrics.avgViewPercentage > 0 && (
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Retention</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-brand-primary">
                    {extendedMetrics.avgViewPercentage.toFixed(1)}%
                  </span>
                </div>
              )}

            {/* Watch Time */}
            {extendedMetrics.watchTimeMinutes !== undefined &&
              extendedMetrics.watchTimeMinutes > 0 && (
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
                    <Clock className="h-3 w-3" />
                    <span>Watch Time</span>
                  </div>
                  <span className="font-mono text-xs font-medium text-foreground">
                    {formatNumber(extendedMetrics.watchTimeMinutes)} min
                  </span>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
