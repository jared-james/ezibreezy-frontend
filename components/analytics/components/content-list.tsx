// components/analytics/components/content-list.tsx

"use client";

import { useState } from "react";
import PostCard from "./post-card";
import type { PostAnalytics } from "@/lib/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ScrollText,
  ChevronDown,
  LayoutGrid,
  Clapperboard,
  History,
  Layers,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentListProps {
  posts: PostAnalytics[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

type FilterType = "all" | "posts" | "videos" | "stories";

export default function ContentList({
  posts,
  isLoading,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: ContentListProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;

    // Updated: Match new type definition ('carousel', 'text')
    if (filter === "posts")
      return (
        post.type === "image" ||
        post.type === "carousel" ||
        post.type === "text"
      );

    if (filter === "videos") return post.type === "video";

    if (filter === "stories") return post.type === "story";

    return true;
  });

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
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="border-b border-dashed border-foreground/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-foreground" />
              The Wire
            </h3>
            <p className="font-serif text-sm text-muted-foreground italic mt-1">
              Transmission log.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="All"
            count={posts.length}
            icon={<Layers className="h-4 w-4" />}
          />
          <FilterButton
            active={filter === "posts"}
            onClick={() => setFilter("posts")}
            label="Posts"
            icon={<LayoutGrid className="h-4 w-4" />}
          />
          <FilterButton
            active={filter === "videos"}
            onClick={() => setFilter("videos")}
            label="Videos"
            icon={<Clapperboard className="h-4 w-4" />}
          />
          <FilterButton
            active={filter === "stories"}
            onClick={() => setFilter("stories")}
            label="Stories"
            icon={<History className="h-4 w-4" />}
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[200px] text-muted-foreground text-center bg-surface/50 border border-dotted border-foreground/10 rounded-sm">
          <p className="font-serif italic text-lg">Signal lost.</p>
          <p className="font-mono text-xs uppercase tracking-widest mt-1">
            No {filter !== "all" ? filter : ""} content found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {hasMore && filter === "all" && (
        <div className="mt-4 pt-4 border-t border-dotted border-foreground/20 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="btn btn-outline h-10 px-6 text-xs font-bold uppercase tracking-widest gap-2 hover:bg-muted border-foreground/20 hover:border-foreground transition-all w-full sm:w-auto disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Load More Archive</span>
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  icon,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors outline-none",
        active
          ? "border-2 border-brand-primary text-brand-primary bg-background shadow-sm"
          : "border-2 border-border text-foreground hover:border-brand-primary/50 bg-background"
      )}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span className="opacity-60 text-xs">({count})</span>
      )}
    </button>
  );
}
