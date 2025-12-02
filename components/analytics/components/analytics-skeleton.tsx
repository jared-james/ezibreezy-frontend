// components/analytics/components/analytics-skeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsSkeleton() {
  return (
    <div className="flex h-full w-full flex-col p-4 2xl:p-6 overflow-y-auto bg-[#fdfbf7]">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-6 border-b border-border pb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
            <Skeleton className="h-9 w-32 shrink-0" />
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-6 border-b border-border pb-6 mb-6">
          <div className="flex flex-col gap-2 w-full sm:w-[240px]">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-[240px]">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="card flex flex-col justify-between gap-4 border border-border bg-surface shadow-sm"
            >
              <div className="flex items-start justify-between border-b border-border/40 pb-3">
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="pt-1 space-y-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="card flex flex-col gap-4 border border-border bg-surface shadow-sm p-6"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-24 rounded-sm" />
              </div>
              <Skeleton className="w-full h-[300px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
