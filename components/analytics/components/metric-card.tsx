// components/analytics/components/metric-card.tsx

"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AnalyticsMetric } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  metric: AnalyticsMetric;
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

export default function MetricCard({ metric }: MetricCardProps) {
  const hasChange =
    metric.percentageChange !== undefined && metric.percentageChange !== null;
  const isPositive = hasChange && metric.percentageChange! > 0;
  const isNegative = hasChange && metric.percentageChange! < 0;
  const isNeutral = hasChange && metric.percentageChange === 0;

  return (
    <div className="card flex flex-col justify-between gap-4 border border-border bg-surface shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between border-b border-border/40 pb-3">
        <h3 className="eyebrow text-[10px] text-muted-foreground">
          {metric.label}
        </h3>
      </div>

      <div className="pt-1">
        <div className="font-serif text-4xl font-bold text-foreground tracking-tight">
          {formatNumber(metric.currentValue)}
        </div>

        {hasChange && (
          <div className="mt-3 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                isPositive
                  ? "bg-success/10 text-success border-success/20"
                  : isNegative
                  ? "bg-error/10 text-error border-error/20"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {isPositive && <TrendingUp className="h-3 w-3" />}
              {isNegative && <TrendingDown className="h-3 w-3" />}
              {isNeutral && <Minus className="h-3 w-3" />}
              {isPositive && "+"}
              {metric.percentageChange!.toFixed(1)}%
            </span>
            <span className="text-[10px] text-muted-foreground font-serif italic">
              vs previous period
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
