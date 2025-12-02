"use client";

import PostCard from "./post-card";
import type { PostAnalytics } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

interface TopPerformingContentProps {
  posts: PostAnalytics[];
  isLoading?: boolean;
}

export default function TopPerformingContent({
  posts,
  isLoading,
}: TopPerformingContentProps) {
  if (isLoading) {
    return (
      <div className="card flex flex-col gap-4 border border-border bg-surface shadow-sm h-full">
        <div className="border-b border-border/40 pb-3">
          <Skeleton className="h-4 w-40 rounded-sm" />
          <Skeleton className="h-3 w-24 mt-2 rounded-sm" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-20 w-20 shrink-0 rounded-sm" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card flex flex-col gap-4 border border-border bg-surface shadow-sm h-full">
        <div className="border-b border-border/40 pb-3">
          <h3 className="eyebrow text-xs font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5" />
            Top Content
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <p className="font-serif italic text-sm">No posts available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex flex-col gap-4 border border-border bg-surface shadow-sm h-full">
      <div className="border-b border-border/40 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="eyebrow text-xs font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-brand-primary" />
            Top Performing Content
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 font-serif italic">
          Ranked by engagement rate
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
