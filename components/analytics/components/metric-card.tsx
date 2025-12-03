// components/analytics/components/metric-card.tsx

"use client";

import type { AnalyticsMetric } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  metric: AnalyticsMetric;
  isSelected?: boolean;
  onClick?: () => void;
  loading?: boolean;
  isPercentage?: boolean;
}

function formatNumber(num: number, isPercentage: boolean): string {
  if (isPercentage) {
    return num.toFixed(2) + "%";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

export default function MetricCard({
  metric,
  isSelected,
  onClick,
  loading = false,
  isPercentage = false,
}: MetricCardProps) {
  // Loading State
  if (loading) {
    return (
      <div className="flex h-[130px] w-full flex-col justify-between rounded-sm border border-border bg-surface p-5">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    );
  }

  // Calculate Trend
  const hasHistory = metric.history && metric.history.length > 1;
  let change = metric.percentageChange;

  if (change === undefined && hasHistory) {
    const current = metric.currentValue;
    const start = metric.history[0].value;
    if (start > 0) {
      change = ((current - start) / start) * 100;
    } else {
      change = 0;
    }
  }

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = !isPositive && !isNegative;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col justify-between p-5 text-left transition-all duration-200 outline-none rounded-sm min-h-[130px]",
        isSelected
          ? "bg-surface border-2 border-brand-primary"
          : "bg-surface/50 border border-border hover:border-foreground/30 hover:bg-surface"
      )}
    >
      {/* Active Indicator Dot (Top Right) */}
      <div
        className={cn(
          "absolute top-4 right-4 h-2 w-2 rounded-full transition-all duration-300",
          isSelected
            ? "bg-brand-primary opacity-100"
            : "bg-foreground/20 opacity-0 group-hover:opacity-50"
        )}
      />

      <div className="flex flex-col gap-1">
        {/* Metric Label - Clean & Readable */}
        <h3
          className={cn(
            "font-sans text-xs font-semibold uppercase tracking-wide transition-colors",
            isSelected ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {metric.label}
        </h3>

        {/* Main Value */}
        <div className="font-mono text-3xl md:text-4xl font-bold text-foreground tracking-tight tabular-nums mt-2">
          {formatNumber(metric.currentValue, isPercentage)}
        </div>
      </div>

      {/* Trend Footer - Minimal Text Only */}
      <div className="flex items-center gap-2 mt-2">
        <span
          className={cn(
            "text-xs font-bold tabular-nums",
            isPositive && "text-emerald-600",
            isNegative && "text-red-600",
            isNeutral && "text-muted-foreground"
          )}
        >
          {change !== undefined && change > 0 ? "+" : ""}
          {change !== undefined ? change.toFixed(1) : "0.0"}%
        </span>
        <span className="text-[10px] text-muted-foreground/60 font-serif italic">
          vs last period
        </span>
      </div>
    </button>
  );
}
