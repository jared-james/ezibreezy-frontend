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
  Youtube,
  Instagram,
  Play,
  Image as ImageIcon,
  Layers,
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

function getPlatformIcon(platform: string) {
  switch (platform) {
    case "youtube":
      return <Youtube className="h-3 w-3" />;
    case "instagram":
      return <Instagram className="h-3 w-3" />;
    default:
      return null;
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "video":
      return <Play className="h-3 w-3" />;
    case "carousel":
      return <Layers className="h-3 w-3" />;
    default:
      return <ImageIcon className="h-3 w-3" />;
  }
}

export default function PostCard({
  post,
  rank,
  layout = "horizontal",
}: PostCardProps) {
  const isVertical = layout === "vertical";

  // Normalization Logic:
  // YouTube = Views, Instagram Reels = Views, Others = Impressions
  const isVideoContent = post.type === "video" || post.platform === "youtube";
  const viewLabel = isVideoContent ? "Views" : "Impressions";

  // Engagement Rate Highlight Threshold
  const isHighPerformance = post.engagementRate >= 5;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 p-4 border border-border bg-background transition-all duration-200 hover:border-brand-primary hover:shadow-sm rounded-sm",
        !isVertical && "sm:flex-row"
      )}
    >
      {/* Thumbnail Section */}
      <div
        className={cn(
          "relative shrink-0 aspect-square bg-muted border border-border group-hover:border-brand-primary/50 transition-colors overflow-hidden rounded-sm",
          isVertical ? "w-full" : "w-full sm:w-32"
        )}
      >
        {/* Rank Badge (Top Performing) */}
        {rank && (
          <div className="absolute top-0 left-0 bg-brand-primary text-foreground font-mono text-xs font-bold px-2 py-1 shadow-sm z-10 border-b border-r border-black/10">
            #{rank}
          </div>
        )}

        {/* Platform Badge (Unified Feed Identifier) */}
        <div className="absolute top-2 right-2 z-10">
          <div
            className={cn(
              "flex items-center justify-center h-6 w-6 rounded-full shadow-sm border border-white/10 text-white",
              post.platform === "youtube"
                ? "bg-[#FF0000]"
                : "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]"
            )}
          >
            {getPlatformIcon(post.platform)}
          </div>
        </div>

        {/* Thumbnail Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.thumbnailUrl}
          alt="Post thumbnail"
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />

        {/* Content Type Badge */}
        <div className="absolute bottom-0 right-0 bg-background/90 text-foreground border-t border-l border-border text-[9px] uppercase tracking-wider font-bold px-2 py-1 flex items-center gap-1.5 backdrop-blur-sm">
          {getTypeIcon(post.type)}
          {post.type}
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col flex-1 min-w-0 justify-between gap-4">
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
              <span>View</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="font-serif text-sm text-foreground leading-relaxed line-clamp-2 border-l-2 border-brand-primary/30 group-hover:border-brand-primary pl-3 transition-colors">
            {post.caption || "No caption provided"}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-3 border-t border-dashed border-border">
          {/* 1. Engagement Rate (Key Metric) */}
          <div className="flex flex-col items-center justify-center p-1 rounded-sm bg-surface/50">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <BarChart3 className="h-3 w-3" />
            </div>
            <span
              className={cn(
                "font-mono text-xs font-bold",
                isHighPerformance ? "text-brand-primary" : "text-foreground"
              )}
            >
              {post.engagementRate.toFixed(1)}%
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

          {/* 5. Saves / Favorites */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <Bookmark className="h-3 w-3" />
            </div>
            <span className="font-mono text-xs font-medium text-foreground">
              {formatNumber(post.saves)}
            </span>
          </div>

          {/* 6. Exposure (Views/Impressions) */}
          <div className="flex flex-col items-center justify-center bg-surface/30 rounded-sm">
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase tracking-wider mb-1">
              <Eye className="h-3 w-3" />
              <span className="sr-only">{viewLabel}</span>
            </div>
            <span className="font-mono text-xs font-medium text-foreground">
              {formatNumber(post.impressions)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
