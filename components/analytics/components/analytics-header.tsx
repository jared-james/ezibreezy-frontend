// components/analytics/components/analytics-header.tsx

"use client";

import { RefreshCw, BarChart2 } from "lucide-react";

interface AnalyticsHeaderProps {
  onRefresh: () => void;
}

export default function AnalyticsHeader({ onRefresh }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col gap-6 border-b border-border pb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <p className="eyebrow">Performance Insights</p>
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground 2xl:text-4xl leading-tight">
            Instagram Analytics
          </h1>
          <p className="font-serif text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Track your Instagram performance and audience growth over time. Data
            updates automatically every 24 hours.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRefresh}
            className="btn btn-outline h-9 px-3 text-xs gap-2 hover:bg-surface-hover transition-all active:scale-95"
            aria-label="Refresh analytics data"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
