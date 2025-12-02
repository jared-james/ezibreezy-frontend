"use client";

import { Instagram, CalendarClock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Connection } from "@/lib/api/integrations";
import type { TimeRange } from "@/lib/types/analytics";

interface AnalyticsFiltersProps {
  integrations: Connection[];
  selectedIntegrationId: string | null;
  onIntegrationChange: (id: string) => void;
  selectedDays: TimeRange;
  onDaysChange: (days: TimeRange) => void;
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
  { value: 60, label: "Last 60 days" },
  { value: 90, label: "Last 90 days" },
];

export default function AnalyticsFilters({
  integrations,
  selectedIntegrationId,
  onIntegrationChange,
  selectedDays,
  onDaysChange,
}: AnalyticsFiltersProps) {
  const triggerClasses =
    "h-9 w-full sm:w-[240px] rounded-sm border-border bg-surface text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-surface-hover hover:border-border-hover focus:ring-brand-primary transition-colors";

  return (
    <div className="flex flex-col sm:flex-row gap-6 border-b border-border pb-6 mb-6">
      {/* Instagram Account Selector */}
      {integrations.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="eyebrow text-[10px]">Source Account</label>
          <Select
            value={selectedIntegrationId || undefined}
            onValueChange={onIntegrationChange}
          >
            <SelectTrigger
              className={triggerClasses}
              aria-label="Select Instagram account"
            >
              <div className="flex items-center gap-2 truncate">
                <Instagram className="h-3.5 w-3.5 shrink-0" />
                <SelectValue placeholder="Select account" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {integrations.map((integration) => (
                <SelectItem key={integration.id} value={integration.id}>
                  @{integration.platformUsername}
                  {integration.name && ` (${integration.name})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Time Range Selector */}
      <div className="flex flex-col gap-2">
        <label className="eyebrow text-[10px]">Date Range</label>
        <Select
          value={selectedDays.toString()}
          onValueChange={(value) => onDaysChange(parseInt(value) as TimeRange)}
        >
          <SelectTrigger
            className={triggerClasses}
            aria-label="Select time range"
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarClock className="h-3.5 w-3.5 shrink-0" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
