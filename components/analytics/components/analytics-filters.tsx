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
  const triggerClasses =
    "h-9 w-full sm:w-[240px] rounded-sm border-border bg-surface text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-surface-hover hover:border-border-hover focus:ring-brand-primary transition-colors";

  const getChannelState = (
    platform: AnalyticsPlatform
  ): "active" | "inactive" | "disabled" => {
    if (platform.accounts.length === 0) return "disabled";
    return (selectedAccounts[platform.id]?.length || 0) > 0
      ? "active"
      : "inactive";
  };

  const getActiveAccountName = () => {
    if (selectionMode === "multi" || !activeAccountId) return null;
    for (const platform of platforms) {
      const account = platform.accounts.find((a) => a.id === activeAccountId);
      if (account) return account.name;
    }
    return null;
  };

  const hasSelectedAccounts = Object.values(selectedAccounts).some(
    (arr) => arr.length > 0
  );

  return (
    <div className="flex flex-col gap-6 border-b border-border pb-6 mb-6">
      {showAccountSelector && (
        <>
          {selectionMode === "multi" && (
            <div className="flex flex-col gap-3">
              <label className="eyebrow text-[10px]">Select Channels</label>
              <div className="flex flex-wrap items-center gap-3">
                {platforms.map((platform) => (
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
                <Link
                  href="/settings/integrations"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Connect Channels</span>
                </Link>
              </div>
            </div>
          )}

          {(hasSelectedAccounts || selectionMode === "single") && (
            <div className="flex flex-col gap-3">
              <label className="eyebrow text-[10px]">Select Accounts</label>
              <div className="flex flex-wrap gap-4">
                {platforms.map((platform) => {
                  const accountIds = selectedAccounts[platform.id] || [];
                  if (platform.accounts.length === 0) return null;

                  return (
                    <div
                      key={platform.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-surface border border-border"
                    >
                      <platform.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex gap-2">
                        {platform.accounts.map((account) => {
                          const isSelected = accountIds.includes(account.id);
                          const showCheckmark =
                            selectionMode === "single" && isSelected;

                          return (
                            <AccountAvatar
                              key={account.id}
                              account={account}
                              isSelected={isSelected}
                              isActive={showCheckmark}
                              isLastSelected={
                                selectionMode === "single" &&
                                isSelected &&
                                accountIds.length === 1
                              }
                              onClick={() =>
                                onAccountClick(platform.id, account.id)
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectionMode === "single" && activeAccountId && (
                <div className="text-xs text-muted-foreground font-serif italic">
                  Viewing data for: {getActiveAccountName()}
                </div>
              )}
            </div>
          )}

          {selectionMode === "multi" && !hasSelectedAccounts && (
            <div className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
              Select a channel or account above to view analytics
            </div>
          )}
        </>
      )}

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
