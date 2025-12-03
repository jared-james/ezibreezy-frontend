// components/analytics/components/metric-card.tsx

"use client";

import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
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
  // If loading, render skeleton state
  if (loading) {
    return (
      <div className="flex h-[140px] w-full flex-col justify-between rounded-sm border border-border bg-surface p-5 shadow-sm">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  // "No Zero" Rule: We always display the card, even if value is 0.
  const hasHistory = metric.history && metric.history.length > 1;

  // Calculate change if not provided by backend/aggregator
  let change = metric.percentageChange;
  if (change === undefined && hasHistory) {
    const current = metric.currentValue;
    // Compare against average of previous period or just the start?
    // Aggregator usually handles this, but fallback logic:
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
        "group flex w-full flex-col justify-between p-5 text-left transition-all duration-200 outline-none rounded-sm",
        isSelected
          ? "bg-surface border-2 border-dashed border-brand-primary shadow-[4px_4px_0_0_rgba(34,197,94,0.1)]"
          : "bg-surface/50 border border-border hover:border-foreground/30 hover:bg-surface hover:shadow-sm"
      )}
    >
      <div className="flex w-full flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Activity
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                isSelected ? "text-brand-primary" : "text-muted-foreground/60"
              )}
            />
            <h3
              className={cn(
                "font-mono text-[10px] uppercase tracking-widest font-bold transition-colors",
                isSelected ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {metric.label}
            </h3>
          </div>
          <div
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              isSelected
                ? "bg-brand-primary shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                : "bg-foreground/10 group-hover:bg-foreground/20"
            )}
          />
        </div>

        {/* Value & Trend */}
        <div className="w-full">
          <div className="font-mono text-4xl font-bold text-foreground tracking-tighter tabular-nums">
            {formatNumber(metric.currentValue, isPercentage)}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm",
                isPositive
                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                  : isNegative
                  ? "bg-red-500/10 text-red-700 border-red-500/20"
                  : "bg-muted text-foreground border-foreground/10"
              )}
            >
              {isPositive && <TrendingUp className="h-3 w-3" />}
              {isNegative && <TrendingDown className="h-3 w-3" />}
              {isNeutral && <Minus className="h-3 w-3" />}
              {change !== undefined ? Math.abs(change).toFixed(1) : "0.0"}%
            </span>
            <span className="font-serif text-xs italic text-muted-foreground">
              vs last period
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
