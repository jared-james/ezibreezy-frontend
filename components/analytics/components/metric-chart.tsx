// components/analytics/components/metric-chart.tsx

"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { CalendarDays, CalendarRange } from "lucide-react";
import type { AnalyticsMetric, DailyMetric } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

interface MetricChartProps {
  metric: AnalyticsMetric;
  granularity: "daily" | "weekly";
  onGranularityChange: (g: "daily" | "weekly") => void;
  className?: string;
}

// --- Helpers ---

function aggregateDataToWeekly(
  history: DailyMetric[],
  metricKey: string
): DailyMetric[] {
  if (!history || history.length === 0) return [];

  const weeklyData: DailyMetric[] = [];
  let currentChunk: number[] = [];
  let chunkStartDate = history[0].date;

  history.forEach((point, index) => {
    currentChunk.push(point.value);

    // End of week (every 7 days) or End of array
    if (currentChunk.length === 7 || index === history.length - 1) {
      const isRate =
        metricKey.includes("rate") || metricKey.includes("percentage");

      const sum = currentChunk.reduce((a, b) => a + b, 0);
      const value = isRate ? sum / currentChunk.length : sum;

      weeklyData.push({
        date: chunkStartDate, // Label week by its start date
        value: value,
      });

      // Reset for next chunk
      currentChunk = [];
      if (index < history.length - 1) {
        chunkStartDate = history[index + 1].date;
      }
    }
  });

  return weeklyData;
}

function formatXAxisDate(
  dateString: string,
  granularity: "daily" | "weekly"
): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions =
    granularity === "weekly"
      ? { month: "short", day: "numeric" }
      : { month: "numeric", day: "numeric" };

  return date.toLocaleDateString("en-US", options);
}

// --- Component ---

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { date: string } }>;
  granularity: "daily" | "weekly";
}

function CustomTooltip({ active, payload, granularity }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const dateObj = new Date(data.payload.date);

  const label =
    granularity === "weekly"
      ? `Week of ${dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })}`
      : dateObj.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });

  return (
    <div className="bg-surface border-2 border-foreground p-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] min-w-[150px]">
      <p className="font-mono text-[10px] text-muted-foreground mb-2 uppercase tracking-widest border-b border-dashed border-foreground/20 pb-1">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-brand-primary" />
        <p className="font-mono text-lg font-bold text-foreground tabular-nums">
          {data.value?.toLocaleString(undefined, {
            maximumFractionDigits: 1,
            minimumFractionDigits: 0,
          })}
        </p>
      </div>
    </div>
  );
}

export default function MetricChart({
  metric,
  granularity,
  onGranularityChange,
  className,
}: MetricChartProps) {
  // Memoize data transformation to avoid recalc on re-renders
  const chartData = useMemo(() => {
    if (granularity === "weekly") {
      return aggregateDataToWeekly(metric.history, metric.key);
    }
    return metric.history;
  }, [metric.history, metric.key, granularity]);

  const isEmpty = !chartData || chartData.length === 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-6 p-6 border border-border bg-surface",
        className
      )}
    >
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {/* Removed Figure text */}
          <h3 className="font-serif text-2xl font-bold text-foreground leading-none">
            {metric.label}
          </h3>
        </div>

        {/* Buttons - Green Dotted Style */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onGranularityChange("daily")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-sm border",
              granularity === "daily"
                ? "border-dashed border-brand-primary text-brand-primary bg-brand-primary/5 shadow-sm"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Daily
          </button>
          <button
            onClick={() => onGranularityChange("weekly")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-sm border",
              granularity === "weekly"
                ? "border-dashed border-brand-primary text-brand-primary bg-brand-primary/5 shadow-sm"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <CalendarRange className="h-3.5 w-3.5" />
            Weekly
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[350px] relative">
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-sm bg-muted/10">
            <p className="font-mono text-xs uppercase tracking-widest">
              No data available for this period
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${metric.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--brand-primary)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--brand-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="2 2"
                stroke="var(--foreground)"
                vertical={false}
                opacity={0.05}
              />

              <XAxis
                dataKey="date"
                tickFormatter={(d) => formatXAxisDate(d, granularity)}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                }}
                stroke="var(--foreground)"
                strokeOpacity={0.1}
                tickLine={false}
                axisLine={{ stroke: "var(--foreground)", strokeOpacity: 0.1 }}
                dy={15}
                minTickGap={30}
              />

              <YAxis
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                }}
                stroke="transparent"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value.toLocaleString(undefined, {
                    notation: "compact",
                    compactDisplay: "short",
                  })
                }
                dx={-10}
              />

              <Tooltip
                content={<CustomTooltip granularity={granularity} />}
                cursor={{
                  stroke: "var(--foreground)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                  opacity: 0.3,
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--brand-primary)"
                strokeWidth={2}
                fill={`url(#gradient-${metric.key})`}
                animationDuration={1500}
                activeDot={{
                  r: 4,
                  fill: "var(--surface)",
                  stroke: "var(--brand-primary)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
