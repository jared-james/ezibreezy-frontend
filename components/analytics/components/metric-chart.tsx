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
    <div className="bg-surface border border-black/10 shadow-[4px_4px_0_0_rgba(0,0,0,0.05)] p-3 rounded-sm min-w-[120px]">
      <p className="font-serif text-xs text-muted-foreground mb-1 uppercase tracking-wider border-b border-border/50 pb-1">
        {date}
      </p>
      <p className="font-serif text-lg font-bold text-foreground">
        {data.value?.toLocaleString()}
      </p>
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
      <div className="card flex flex-col gap-4 border border-border bg-surface shadow-sm">
        <div className="border-b border-border/40 pb-3">
          <h3 className="eyebrow text-[10px] text-muted-foreground">
            {metric.label} Trend
          </h3>
        </div>
        <div className="flex items-center justify-center h-[300px]">
          <p className="font-serif italic text-muted-foreground/60 text-sm">
            No historical data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex flex-col gap-4 border border-border bg-surface shadow-sm p-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-2">
        <h3 className="eyebrow text-xs font-bold text-foreground">
          {metric.label} Trend
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground uppercase bg-muted/30 px-2 py-0.5 rounded-sm">
          Last {metric.history.length} Days
        </span>
      </div>

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
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
              opacity={0.6}
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisDate}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 10,
                fontFamily: "var(--font-serif)",
              }}
              stroke="var(--border)"
              tickLine={false}
              axisLine={false}
              dy={10}
              minTickGap={30}
            />

            <YAxis
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 10,
                fontFamily: "var(--font-serif)",
              }}
              stroke="var(--border)"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              dx={-10}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--border)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--brand-primary)"
              strokeWidth={2}
              fill={`url(#gradient-${metric.key})`}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
