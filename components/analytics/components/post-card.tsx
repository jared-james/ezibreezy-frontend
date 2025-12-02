"use client";

import {
  ExternalLink,
  Heart,
  MessageCircle,
  Bookmark,
  Eye,
  BarChart3,
} from "lucide-react";
import type { PostAnalytics } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostAnalytics;
  rank?: number;
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

export default function PostCard({ post, rank }: PostCardProps) {
  return (
    <div className="group relative flex flex-col sm:flex-row gap-4 p-3 border border-border bg-white rounded-sm hover:border-brand-primary hover:shadow-sm transition-all duration-200">
      <div className="relative shrink-0 w-full sm:w-32 aspect-square bg-muted border border-border/50 rounded-sm overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.thumbnailUrl}
          alt="Post thumbnail"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {rank && (
          <div className="absolute top-0 left-0 bg-brand-primary text-white font-mono text-xs font-bold px-2 py-1 shadow-sm rounded-br-sm z-10">
            #{rank}
          </div>
        )}

        <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm">
          {post.type.replace("_", " ")}
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <p className="font-serif text-sm text-foreground leading-relaxed line-clamp-2 mb-4">
          {truncateCaption(post.caption)}
        </p>

        <div className="grid grid-cols-4 gap-2 mt-auto">
          <div className="flex flex-col gap-1 p-2 bg-surface-hover/50 rounded-sm border border-border/50">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              <BarChart3 className="h-3 w-3" />
              <span>Eng. Rate</span>
            </div>
            <span
              className={cn(
                "font-mono text-sm font-bold",
                post.metrics.engagementRate >= 5
                  ? "text-success"
                  : "text-foreground"
              )}
            >
              {post.metrics.engagementRate.toFixed(1)}%
            </span>
          </div>

          <div className="flex flex-col gap-1 p-2 rounded-sm border border-transparent hover:border-border/50 hover:bg-surface-hover/30 transition-colors">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              <Heart className="h-3 w-3" />
              <span>Likes</span>
            </div>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatNumber(post.metrics.likes)}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-2 rounded-sm border border-transparent hover:border-border/50 hover:bg-surface-hover/30 transition-colors">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              <MessageCircle className="h-3 w-3" />
              <span>Comm.</span>
            </div>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatNumber(post.metrics.comments)}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-2 rounded-sm border border-transparent hover:border-border/50 hover:bg-surface-hover/30 transition-colors">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              <Bookmark className="h-3 w-3" />
              <span>Saves</span>
            </div>
            <span className="font-mono text-sm font-medium text-foreground">
              {formatNumber(post.metrics.saves)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-dotted border-border/60">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
            <span>{formatDate(post.postedAt)}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(post.metrics.impressions)}
            </span>
          </div>

          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-wider"
          >
            View Post <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
