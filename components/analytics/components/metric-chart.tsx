// components/analytics/components/metric-chart.tsx

"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { AnalyticsMetric } from "@/lib/types/analytics";

interface MetricChartProps {
  metric: AnalyticsMetric;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date: string;
      value: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const date = new Date(data.payload.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-surface border-2 border-foreground p-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] min-w-[140px]">
      <p className="font-mono text-[10px] text-muted-foreground mb-2 uppercase tracking-widest border-b border-dashed border-foreground/20 pb-1">
        {date}
      </p>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-brand-primary" />
        <p className="font-mono text-lg font-bold text-foreground tabular-nums">
          {data.value?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function formatXAxisDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MetricChart({ metric }: MetricChartProps) {
  if (!metric.history || metric.history.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-[300px] justify-center items-center text-center bg-surface-hover/30 rounded-sm">
        <div className="space-y-2">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            No Data Available
          </h3>
          <p className="font-serif italic text-muted-foreground/60 text-sm">
            Insufficient historical records for {metric.label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Chart Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">
            Figure 1.0 // Trend Analysis
          </span>
          <h3 className="font-serif text-2xl font-bold text-foreground leading-none">
            {metric.label}
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-foreground border-b border-foreground/20 pb-0.5 uppercase tracking-wider">
          {metric.history.length} Day Scope
        </span>
      </div>

      {/* The Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={metric.history}
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
                  stopOpacity={0.1}
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
              opacity={0.1}
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisDate}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 10,
                fontFamily: "var(--font-mono)", // Monospace ticks
              }}
              stroke="var(--foreground)"
              strokeOpacity={0.2}
              tickLine={false}
              axisLine={{ stroke: "var(--foreground)", strokeOpacity: 0.2 }}
              dy={15}
              minTickGap={40}
            />

            <YAxis
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 10,
                fontFamily: "var(--font-mono)", // Monospace ticks
              }}
              stroke="transparent"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              dx={-10}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--foreground)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
                opacity: 0.5,
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
      </div>
    </div>
  );
}
