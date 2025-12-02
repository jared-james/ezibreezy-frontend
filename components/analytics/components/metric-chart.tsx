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
import { Lock, AlertTriangle } from "lucide-react";
import type { AnalyticsMetric, AccountStatus } from "@/lib/types/analytics";

interface MetricChartProps {
  metric: AnalyticsMetric;
  accountStatus?: AccountStatus;
  errorMessage?: string;
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

export default function MetricChart({
  metric,
  accountStatus,
  errorMessage,
}: MetricChartProps) {
  const isRestricted =
    accountStatus === "error" ||
    (errorMessage && errorMessage.includes("followers"));

  if (isRestricted) {
    return (
      <div className="flex flex-col gap-6 p-4 relative overflow-hidden">
        <div className="flex items-end justify-between opacity-50 blur-[2px] select-none pointer-events-none">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">
              Figure 1.0 // Trend Analysis
            </span>
            <h3 className="font-serif text-2xl font-bold text-foreground leading-none">
              {metric.label}
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-foreground border-b border-foreground/20 pb-0.5 uppercase tracking-wider">
            30 Day Scope
          </span>
        </div>

        <div className="w-full h-[300px] bg-muted/20 relative rounded-sm border-2 border-dashed border-foreground/10">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-surface/80 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-full bg-background border-2 border-foreground flex items-center justify-center mb-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">
              Data Restricted
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              {errorMessage ||
                "This metric is currently unavailable for this account due to platform requirements."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!metric.history || metric.history.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-[300px] justify-center items-center text-center bg-surface-hover/30 rounded-sm border border-dashed border-foreground/10">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
          <AlertTriangle className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <div className="space-y-1">
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
                fontFamily: "var(--font-mono)",
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
                fontFamily: "var(--font-mono)",
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
