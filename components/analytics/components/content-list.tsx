// components/analytics/components/content-list.tsx

"use client";

import { useState } from "react";
import PostCard from "./post-card";
import type { PostAnalytics } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollText, ChevronDown, ChevronUp } from "lucide-react";

interface ContentListProps {
  posts: PostAnalytics[];
  isLoading?: boolean;
}

export default function ContentList({ posts, isLoading }: ContentListProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedPosts = showAll ? posts : posts.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6 h-full">
        <div className="border-b border-dashed border-foreground/20 pb-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-20 w-20 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex gap-4 mt-2">
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
      <div className="flex flex-col gap-4 p-6 h-full">
        <div className="border-b border-dashed border-foreground/20 pb-4">
          <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Recent Dispatches
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 min-h-[200px] text-muted-foreground text-center">
          <p className="font-serif italic text-lg">The wire is silent.</p>
          <p className="font-mono text-xs uppercase tracking-widest mt-1">
            No recent transmissions found
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
            <ScrollText className="h-5 w-5 text-foreground" />
            The Wire
          </h3>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest bg-foreground/5 border border-foreground/10 px-2 py-1">
            Chronological
          </span>
        </div>
        <p className="font-serif text-sm text-muted-foreground italic">
          Complete log of published material.
        </p>
      </div>

      <div className="space-y-4">
        {displayedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length > 5 && (
        <div className="mt-4 pt-4 border-t border-dotted border-foreground/20 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn btn-outline h-10 px-6 text-xs font-bold uppercase tracking-widest gap-2 hover:bg-muted border-foreground/20 hover:border-foreground transition-all w-full sm:w-auto"
          >
            {showAll ? (
              <>
                <span>Collapse Feed</span>
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                <span>Load Full Archive ({posts.length})</span>
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
