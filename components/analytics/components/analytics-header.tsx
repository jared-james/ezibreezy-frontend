// components/analytics/components/analytics-header.tsx

"use client";

import { RefreshCw, BarChart2 } from "lucide-react";

interface AnalyticsHeaderProps {
  onRefresh: () => void;
}

export default function AnalyticsHeader({ onRefresh }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col gap-6 border-b-4 border-double border-foreground pb-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-primary">
            <BarChart2 className="h-4 w-4" />
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
              Comprehensive Breakdown
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-[0.9]">
            Performance Report
          </h1>
        </div>

        <div className="flex items-center shrink-0">
          <button
            onClick={onRefresh}
            className="btn btn-outline h-10 px-6 text-xs font-bold gap-2 hover:bg-surface-hover hover:border-foreground transition-all uppercase tracking-widest"
            aria-label="Refresh analytics data"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync</span>
          </button>
        </div>
      </div>
    </div>
  );
}
