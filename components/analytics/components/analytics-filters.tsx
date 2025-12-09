// components/analytics/components/analytics-filters.tsx

"use client";

import { CalendarClock, PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChannelCircleButton } from "@/components/ui/channel-circle-button";
import { AccountAvatar } from "./account-avatar";
import type { AnalyticsPlatform, TimeRange } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

interface AnalyticsFiltersProps {
  platforms: AnalyticsPlatform[];
  selectedAccounts: Record<string, string[]>;
  activeAccountId: string | null;
  selectionMode?: "single" | "multi";
  onTogglePlatform?: (platformId: string) => void;
  onAccountClick: (platformId: string, accountId: string) => void;
  selectedDays: TimeRange;
  onDaysChange: (days: TimeRange) => void;
  showAccountSelector?: boolean;
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

export default function AnalyticsFilters({
  platforms,
  selectedAccounts,
  activeAccountId,
  selectionMode = "multi",
  onTogglePlatform,
  onAccountClick,
  selectedDays,
  onDaysChange,
  showAccountSelector = true,
}: AnalyticsFiltersProps) {
  const { currentWorkspace } = useWorkspaceStore();

  // Helper for Headquarters (Multi-select platforms)
  const getChannelState = (
    platform: AnalyticsPlatform
  ): "active" | "inactive" | "disabled" => {
    if (platform.accounts.length === 0) return "disabled";
    return (selectedAccounts[platform.id]?.length || 0) > 0
      ? "active"
      : "inactive";
  };

  const triggerClasses =
    "h-9 w-full sm:w-[200px] rounded-sm border-border bg-surface text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-surface-hover hover:border-border-hover focus:ring-brand-primary transition-colors";

  const workspaceSlug = currentWorkspace?.slug || currentWorkspace?.id || "";

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-6 mb-6">
      {/* LEFT: Account/Platform Selector */}
      <div className="flex-1">
        {showAccountSelector && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <label className="eyebrow text-[10px]">
                {selectionMode === "multi"
                  ? "Select Channels"
                  : "Select Account"}
              </label>

              {/* Connect Link (Only show if no accounts or multi mode) */}
              {selectionMode === "multi" && (
                <Link
                  href={`/${workspaceSlug}/settings/integrations`}
                  className="flex items-center gap-1.5 font-serif text-[10px] text-brand-primary hover:underline"
                >
                  <PlusCircle className="h-3 w-3" />
                  Connect
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* MODE: Multi-Select (Headquarters) - Uses ChannelCircleButton */}
              {selectionMode === "multi" &&
                platforms.map((platform) => (
                  <ChannelCircleButton
                    key={platform.id}
                    state={getChannelState(platform)}
                    onClick={() =>
                      platform.accounts.length > 0 &&
                      onTogglePlatform &&
                      onTogglePlatform(platform.id)
                    }
                    disabled={platform.accounts.length === 0}
                    aria-label={platform.name}
                  >
                    <platform.icon className="h-5 w-5" />
                  </ChannelCircleButton>
                ))}

              {/* MODE: Single-Select (Instagram/YouTube) - Uses AccountAvatar */}
              {selectionMode === "single" && (
                <>
                  {platforms.flatMap((platform) =>
                    platform.accounts.map((account) => {
                      const isSelected = activeAccountId === account.id;

                      return (
                        // Using the AccountAvatar but ensuring it sits in the flex row
                        <div key={account.id} className="relative group">
                          <AccountAvatar
                            account={account}
                            isSelected={isSelected}
                            isActive={isSelected}
                            isLastSelected={false} // Allow clicking even if selected to refresh
                            onClick={() =>
                              onAccountClick(platform.id, account.id)
                            }
                          />
                        </div>
                      );
                    })
                  )}

                  {platforms.every((p) => p.accounts.length === 0) && (
                    <div className="text-xs text-muted-foreground font-serif italic py-2">
                      No accounts connected.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Date Range Selector */}
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <label className="eyebrow text-[10px] sm:text-right">Timeframe</label>
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
          <SelectContent align="end">
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
