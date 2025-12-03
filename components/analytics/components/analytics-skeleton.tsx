// components/analytics/components/analytics-skeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsSkeleton() {
  return (
    <div className="flex h-full w-full flex-col p-6 lg:p-10 overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-6 border-b-4 border-double border-foreground/10 pb-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-6 border-b border-border pb-1">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>

        {/* Date Filter Skeleton */}
        <div className="flex flex-col gap-2 w-full sm:w-[240px] mb-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Core Metrics Grid (4 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex h-[140px] w-full flex-col justify-between rounded-sm border border-border bg-surface p-5"
            >
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-2 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart Skeleton */}
        <div className="flex flex-col gap-6 p-6 border border-border bg-surface min-h-[400px]">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="w-full flex-1 rounded-sm" />
        </div>

        <div className="py-2">
          <div className="w-full border-t border-dashed border-foreground/20" />
        </div>

        {/* Content Section Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
          {/* Top Performing Column */}
          <div className="xl:col-span-1 flex flex-col gap-4 p-6 border border-border bg-surface rounded-sm">
            <div className="border-b border-dashed border-foreground/20 pb-4 mb-2">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="w-full aspect-square rounded-sm" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content List Column */}
          <div className="xl:col-span-2 flex flex-col gap-4 p-6 border border-border bg-surface rounded-sm">
            <div className="border-b border-dashed border-foreground/20 pb-4 mb-2">
              <Skeleton className="h-6 w-32 mb-2" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-32 gap-4 border border-border p-4 rounded-sm"
                >
                  <Skeleton className="h-full aspect-square rounded-sm" />
                  <div className="flex-1 space-y-3 py-1">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
