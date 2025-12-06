// app/(app)/analytics/analytics-client.tsx

"use client";

import { useState } from "react";
import { useAnalyticsFilters } from "@/components/analytics/hooks/use-analytics-filters";
import { useAggregatedAnalytics } from "@/components/analytics/hooks/use-aggregated-analytics";
import type { Connection } from "@/lib/types/integrations";

import AnalyticsHeader from "@/components/analytics/components/analytics-header";
import AnalyticsTabs from "@/components/analytics/components/analytics-tabs";
import AnalyticsFilters from "@/components/analytics/components/analytics-filters";
import MetricCard from "@/components/analytics/components/metric-card";
import MetricChart from "@/components/analytics/components/metric-chart";
import TopPerformingContent from "@/components/analytics/components/top-performing-content";
import ContentList from "@/components/analytics/components/content-list";
import AnalyticsSkeleton from "@/components/analytics/components/analytics-skeleton";
import AnalyticsError from "@/components/analytics/components/analytics-error";
import { BarChart3 } from "lucide-react";
import { useUnifiedPostAnalytics } from "@/components/analytics/hooks/use-unified-post-analytics";

interface AnalyticsClientProps {
  workspaceId: string;
  initialConnections?: Connection[];
}

export default function AnalyticsClient({
  workspaceId,
  initialConnections,
}: AnalyticsClientProps) {
  const filters = useAnalyticsFilters();
  const [selectedMetricKey, setSelectedMetricKey] =
    useState<string>("total_audience");
  const [chartGranularity, setChartGranularity] = useState<"daily" | "weekly">(
    "daily"
  );

  const targetAccounts = filters.platforms.flatMap((p) => {
    const selectedIds = filters.selectedAccounts[p.id] || [];
    return p.accounts.filter((acc) => selectedIds.includes(acc.id));
  });

  const {
    totalAudience,
    totalExposure,
    totalEngagement,
    globalEngagementRate,
    isLoading,
    errors,
  } = useAggregatedAnalytics({
    accounts: targetAccounts,
    days: filters.selectedDays,
  });

  const {
    posts,
    topPosts,
    isLoading: isLoadingPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUnifiedPostAnalytics({
    accounts: targetAccounts,
    limit: 12,
  });

  const activeMetric =
    selectedMetricKey === "total_audience"
      ? totalAudience.metric
      : selectedMetricKey === "total_exposure"
      ? totalExposure.metric
      : selectedMetricKey === "total_engagement"
      ? totalEngagement.metric
      : globalEngagementRate.metric;

  if (filters.isLoadingIntegrations) {
    return <AnalyticsSkeleton />;
  }

  if (targetAccounts.length === 0) {
    const hasAnyConnections = filters.platforms.some(
      (p) => p.accounts.length > 0
    );

    if (!hasAnyConnections) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-[#f4f4f0]">
          <div className="max-w-md space-y-6 p-8 border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-muted">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-foreground">
                Establish Uplink
              </h2>
              <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                Wire service disconnected. Connect your Instagram or YouTube
                account in Settings to receive data transmission.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  if (errors.length === targetAccounts.length && errors.length > 0) {
    return (
      <AnalyticsError
        error={errors[0]}
        onRetry={() => window.location.reload()}
        integrationId={null}
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-10">
        <AnalyticsHeader />
        <AnalyticsTabs />

        <AnalyticsFilters
          showAccountSelector={true}
          selectionMode="multi"
          platforms={filters.platforms}
          selectedAccounts={filters.selectedAccounts}
          activeAccountId={null}
          onTogglePlatform={filters.togglePlatform}
          onAccountClick={filters.toggleAccount}
          selectedDays={filters.selectedDays}
          onDaysChange={filters.setSelectedDays}
        />

        {targetAccounts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
              <MetricCard
                metric={totalAudience.metric}
                isSelected={selectedMetricKey === "total_audience"}
                onClick={() => setSelectedMetricKey("total_audience")}
                loading={totalAudience.isLoading}
              />
              <MetricCard
                metric={totalExposure.metric}
                isSelected={selectedMetricKey === "total_exposure"}
                onClick={() => setSelectedMetricKey("total_exposure")}
                loading={totalExposure.isLoading}
              />
              <MetricCard
                metric={totalEngagement.metric}
                isSelected={selectedMetricKey === "total_engagement"}
                onClick={() => setSelectedMetricKey("total_engagement")}
                loading={totalEngagement.isLoading}
              />
              <MetricCard
                metric={globalEngagementRate.metric}
                isSelected={selectedMetricKey === "global_engagement_rate"}
                onClick={() => setSelectedMetricKey("global_engagement_rate")}
                loading={globalEngagementRate.isLoading}
                isPercentage
              />
            </div>

            <div className="bg-surface transition-all duration-300">
              <MetricChart
                metric={activeMetric}
                granularity={chartGranularity}
                onGranularityChange={setChartGranularity}
              />
            </div>

            <div className="py-6">
              <div className="w-full border-t border-dashed border-foreground/30" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
              <div className="xl:col-span-1">
                <TopPerformingContent
                  posts={topPosts}
                  isLoading={isLoadingPosts}
                  label="Headliners"
                />
              </div>
              <div className="xl:col-span-2">
                <ContentList
                  posts={posts}
                  isLoading={isLoadingPosts}
                  hasMore={hasNextPage}
                  onLoadMore={() => fetchNextPage()}
                  isLoadingMore={isFetchingNextPage}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-sm">
            <p className="text-muted-foreground font-serif italic">
              Select channels above to view aggregated data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
