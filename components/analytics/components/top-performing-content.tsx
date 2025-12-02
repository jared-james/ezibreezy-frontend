// components/analytics/components/top-performing-content.tsx

"use client";

import PostCard from "./post-card";
import type { PostAnalytics } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Star } from "lucide-react";

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
      <div className="flex flex-col gap-4 p-6 h-full">
        <div className="border-b border-dashed border-foreground/20 pb-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="w-full aspect-square shrink-0" />
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
      <div className="flex flex-col gap-4 p-6 h-full">
        <div className="border-b border-dashed border-foreground/20 pb-4">
          <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-brand-primary" />
            The Headliners
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 min-h-[200px] text-muted-foreground text-center">
          <p className="font-serif italic text-lg">No outliers detected.</p>
          <p className="font-mono text-xs uppercase tracking-widest mt-1">
            Wait for audience reception
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="border-b border-dashed border-foreground/20 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-serif text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
            <Star className="h-5 w-5 text-brand-primary fill-brand-primary" />
            Top Stories
          </h3>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest bg-foreground text-background px-2 py-1">
            Vol. High
          </span>
        </div>
        <p className="font-serif text-sm text-muted-foreground italic">
          Highest engagement velocity this period.
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            rank={index + 1}
            layout="vertical"
          />
        ))}
      </div>
    </div>
  );
}
