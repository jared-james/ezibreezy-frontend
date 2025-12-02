"use client";

import { useState } from "react";
import PostCard from "./post-card";
import type { PostAnalytics } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { List, ChevronDown, ChevronUp } from "lucide-react";

interface ContentListProps {
  posts: PostAnalytics[];
  isLoading?: boolean;
}

export default function ContentList({ posts, isLoading }: ContentListProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedPosts = showAll ? posts : posts.slice(0, 5);

  if (isLoading) {
    return (
      <div className="card flex flex-col gap-4 border border-border bg-surface shadow-sm h-full">
        <div className="border-b border-border/40 pb-3">
          <Skeleton className="h-4 w-32 rounded-sm" />
          <Skeleton className="h-3 w-48 mt-2 rounded-sm" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-20 w-20 shrink-0 rounded-sm" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex gap-4 mt-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-12" />
                </div>
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
            <List className="h-3.5 w-3.5" />
            Recent Content
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <p className="font-serif italic text-sm">No posts available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex flex-col gap-6 border border-border bg-surface shadow-sm h-full">
      <div className="border-b border-border/40 pb-3">
        <h3 className="eyebrow text-xs font-bold text-foreground flex items-center gap-2">
          <List className="h-3.5 w-3.5" />
          Recent Content
        </h3>
        <p className="text-[10px] text-muted-foreground mt-1 font-serif italic">
          Performance metrics for your latest posts
        </p>
      </div>

      <div className="space-y-4">
        {displayedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length > 5 && (
        <div className="mt-2 pt-4 border-t border-border/40 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn btn-outline h-8 px-4 text-[10px] gap-2 hover:bg-surface-hover w-full sm:w-auto"
          >
            {showAll ? (
              <>
                <span>Show Less</span>
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                <span>Show All ({posts.length})</span>
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
