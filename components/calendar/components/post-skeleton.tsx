// components/calendar/components/post-skeleton.tsx

"use client";

import { cn } from "@/lib/utils";

interface PostSkeletonProps {
  count?: number;
  className?: string;
}

export function PostSkeleton({ count = 1, className }: PostSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "relative flex w-full flex-col items-start rounded-md border border-border bg-white shadow-sm",
            "2xl:flex-row 2xl:items-center",
            "p-1.5 gap-2 2xl:p-2 2xl:gap-3",
            "animate-pulse",
            className
          )}
        >
          {/* Visuals Container */}
          <div className="flex w-full items-center justify-start gap-2 2xl:w-auto 2xl:gap-3">
            {/* Icon Skeleton */}
            <div className="flex shrink-0 items-center justify-center rounded-full bg-muted/50 h-5 w-5 2xl:h-8 2xl:w-8">
              <div className="h-3 w-3 2xl:h-4 2xl:w-4 rounded-full bg-muted" />
            </div>

            {/* Thumbnail Skeleton (50% chance) */}
            {i % 2 === 0 && (
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-muted 2xl:h-10 2xl:w-10" />
            )}
          </div>

          {/* Text Content Skeleton */}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {/* Caption line */}
            <div className="h-3 w-3/4 rounded bg-muted" />
            {/* Time/date line */}
            <div className="h-2.5 w-1/2 rounded bg-muted/70" />
          </div>
        </div>
      ))}
    </>
  );
}

export function DaySlotSkeleton() {
  return (
    <div className="flex h-full min-h-[100px] flex-col gap-1.5 p-1.5">
      <PostSkeleton count={2} />
    </div>
  );
}
