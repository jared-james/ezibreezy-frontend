// components/analytics/components/metric-card.tsx

"use client";

import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import type { AnalyticsMetric } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  metric: AnalyticsMetric;
  isSelected?: boolean;
  onClick?: () => void;
}

function formatNumber(num: number): string {
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
}: MetricCardProps) {
  const hasChange =
    metric.percentageChange !== undefined && metric.percentageChange !== null;
  const isPositive = hasChange && metric.percentageChange! > 0;
  const isNegative = hasChange && metric.percentageChange! < 0;
  const isNeutral = hasChange && metric.percentageChange === 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col justify-between p-5 text-left transition-all duration-200 outline-none",
        isSelected
          ? "bg-surface border-2 border-dashed border-brand-primary"
          : "bg-surface/50 border-2 border-dashed border-foreground/20 hover:border-foreground/40 hover:bg-surface"
      )}
    >
      <div className="flex w-full flex-col gap-4">
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

        <div className="w-full">
          <div className="font-mono text-4xl font-bold text-foreground tracking-tighter tabular-nums">
            {formatNumber(metric.currentValue)}
          </div>

          {hasChange && (
            <div className="mt-3 flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 border border-dashed px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  isPositive
                    ? "bg-brand-primary/5 text-brand-primary border-brand-primary/30"
                    : isNegative
                    ? "bg-red-600/5 text-red-600 border-red-600/30"
                    : "bg-muted text-foreground border-foreground/30"
                )}
              >
                {isPositive && <TrendingUp className="h-3 w-3" />}
                {isNegative && <TrendingDown className="h-3 w-3" />}
                {isNeutral && <Minus className="h-3 w-3" />}
                {isPositive && "+"}
                {metric.percentageChange!.toFixed(1)}%
              </span>
              <span className="font-serif text-xs italic text-muted-foreground">
                vs last period
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
