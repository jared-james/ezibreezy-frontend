"use client";

import { useState, useEffect } from "react";
import { useAnalyticsFilters } from "./hooks/use-analytics-filters";
import { useAnalyticsData } from "./hooks/use-analytics-data";
import { usePostAnalytics } from "./hooks/use-post-analytics";

import AnalyticsHeader from "./components/analytics-header";
import AnalyticsFilters from "./components/analytics-filters";
import MetricCard from "./components/metric-card";
import MetricChart from "./components/metric-chart";
import AnalyticsSkeleton from "./components/analytics-skeleton";
import AnalyticsError from "./components/analytics-error";
import AnalyticsWarnings from "./components/analytics-warnings";
import TopPerformingContent from "./components/top-performing-content";
import ContentList from "./components/content-list";
import type { AnalyticsMetric } from "@/lib/types/analytics";
import { BarChart3 } from "lucide-react";

const METRIC_ORDER = [
  "impressions",
  "reach",
  "views",
  "followers",
  "followers_gained",
  "subscribers_gained",
  "engagement_count",
  "watch_time_minutes",
  "avg_view_duration",
  "profile_views",
  "website_clicks",
];

function sortMetricsByOrder(metrics: AnalyticsMetric[]) {
  return [...metrics].sort((a, b) => {
    const indexA = METRIC_ORDER.indexOf(a.key);
    const indexB = METRIC_ORDER.indexOf(b.key);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return a.label.localeCompare(b.label);
  });
}

// Dummy metric to force-render the chart in "Locked" state
const LOCKED_METRIC_PLACEHOLDER: AnalyticsMetric = {
  key: "restricted",
  label: "Restricted Data",
  currentValue: 0,
  history: [],
};

export default function AnalyticsContainer() {
  const filters = useAnalyticsFilters();
  const {
    metrics,
    warnings,
    dataQuality,
    isLoading,
    isError,
    error,
    refetch,
  } = useAnalyticsData({
    integrationId: filters.activeAccountId,
    days: filters.selectedDays,
  });

  const {
    topPosts,
    posts,
    warnings: postWarnings,
    isLoading: isLoadingPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostAnalytics({
    integrationId: filters.activeAccountId,
    limit: 12,
  });

  const [selectedMetricKey, setSelectedMetricKey] = useState<string | null>(
    null
  );

  const sortedMetrics = sortMetricsByOrder(metrics);

  useEffect(() => {
    if (sortedMetrics.length > 0) {
      const exists = sortedMetrics.find((m) => m.key === selectedMetricKey);
      if (!exists) {
        setSelectedMetricKey(sortedMetrics[0].key);
      }
    }
  }, [sortedMetrics, selectedMetricKey]);

  if (filters.isLoadingIntegrations || (isLoading && !metrics.length)) {
    // If we are loading, show skeleton.
    // BUT if we have an error on the account itself (e.g. 100 followers), we want to fall through
    // to render the "Locked" state, not get stuck on Skeleton.
    const activePlatform = filters.platforms.find((p) =>
      p.accounts.some((a) => a.id === filters.activeAccountId)
    );
    const activeAccount = activePlatform?.accounts.find(
      (a) => a.id === filters.activeAccountId
    );

    if (!activeAccount?.status || activeAccount.status === "active") {
      return <AnalyticsSkeleton />;
    }
  }

  if (isError) {
    return (
      <AnalyticsError
        error={error}
        onRetry={refetch}
        integrationId={filters.activeAccountId}
      />
    );
  }

  if (
    !filters.isLoadingIntegrations &&
    filters.platforms.every((p) => p.accounts.length === 0)
  ) {
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

  const activePlatform = filters.platforms.find((p) =>
    p.accounts.some((a) => a.id === filters.activeAccountId)
  );
  const activeAccount = activePlatform?.accounts.find(
    (a) => a.id === filters.activeAccountId
  );

  // If we have real metrics, use the selected one.
  // If we have NO metrics, but the account has an error, use a placeholder so the Chart component renders and shows the error overlay.
  const activeMetric =
    sortedMetrics.find((m) => m.key === selectedMetricKey) ||
    sortedMetrics[0] ||
    (activeAccount?.status === "error" ? LOCKED_METRIC_PLACEHOLDER : null);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-10">
        <AnalyticsHeader />

        <AnalyticsFilters
          platforms={filters.platforms}
          selectedAccounts={filters.selectedAccounts}
          activeAccountId={filters.activeAccountId}
          onTogglePlatform={filters.togglePlatform}
          onSelectAccount={filters.selectAccount}
          selectedDays={filters.selectedDays}
          onDaysChange={filters.setSelectedDays}
        />

        {warnings && warnings.length > 0 && (
          <AnalyticsWarnings
            warnings={warnings}
            dataQualityStatus={dataQuality?.status}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
          {sortedMetrics.map((metric) => (
            <MetricCard
              key={metric.key}
              metric={metric}
              isSelected={selectedMetricKey === metric.key}
              onClick={() => setSelectedMetricKey(metric.key)}
            />
          ))}
          {sortedMetrics.length === 0 && activeAccount?.status === "error" && (
            <div className="col-span-full py-4 text-center text-sm text-muted-foreground font-serif italic bg-surface/50 border border-dashed border-border rounded-sm">
              Metrics unavailable. See chart below for details.
            </div>
          )}
        </div>

        {activeMetric && (
          <>
            <div className="bg-surface transition-all duration-300">
              <MetricChart
                metric={activeMetric}
                accountStatus={activeAccount?.status}
                errorMessage={activeAccount?.errorMessage}
              />
            </div>

            <div className="py-6">
              <div className="w-full border-t border-dashed border-foreground/30" />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
          <div className="xl:col-span-1">
            <TopPerformingContent posts={topPosts} isLoading={isLoadingPosts} />
          </div>

          <div className="xl:col-span-2 space-y-4">
            {postWarnings && postWarnings.length > 0 && (
              <AnalyticsWarnings warnings={postWarnings} />
            )}
            <ContentList
              posts={posts}
              isLoading={isLoadingPosts}
              hasMore={hasNextPage}
              onLoadMore={() => fetchNextPage()}
              isLoadingMore={isFetchingNextPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
