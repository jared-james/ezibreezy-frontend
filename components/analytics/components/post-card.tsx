// components/analytics/components/post-card.tsx

"use client";

import {
  ExternalLink,
  Heart,
  MessageCircle,
  Eye,
  BarChart3,
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

export default function PostCard({
  post,
  rank,
  layout = "horizontal",
}: PostCardProps) {
  const isVertical = layout === "vertical";

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 p-4 border border-foreground/20 bg-background transition-colors duration-200 hover:border-foreground",
        !isVertical && "sm:flex-row"
      )}
    >
      <div
        className={cn(
          "relative shrink-0 aspect-square bg-muted border border-foreground/10 group-hover:border-foreground transition-colors overflow-hidden",
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
          <div className="absolute top-0 left-0 bg-foreground text-background font-mono text-xs font-bold px-2 py-1 shadow-sm z-10 border-b border-r border-white/20">
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
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </a>
          </div>

          <p className="font-serif text-sm text-foreground leading-relaxed line-clamp-2 border-l-2 border-brand-primary pl-3">
            {truncateCaption(post.caption)}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <BarChart3 className="h-3 w-3" />
            </div>
            <span
              className={cn(
                "font-mono text-xs font-bold",
                post.metrics.engagementRate >= 5
                  ? "text-brand-primary"
                  : "text-foreground"
              )}
            >
              {post.metrics.engagementRate.toFixed(1)}%
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <Heart className="h-3 w-3" />
            </div>
            <span className="font-mono text-xs font-medium text-foreground">
              {formatNumber(post.metrics.likes)}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <MessageCircle className="h-3 w-3" />
            </div>
            <span className="font-mono text-xs font-medium text-foreground">
              {formatNumber(post.metrics.comments)}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <Eye className="h-3 w-3" />
            </div>
            <span className="font-mono text-xs font-medium text-foreground">
              {formatNumber(post.metrics.impressions)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
