"use client";

import { useAnalyticsFilters } from "./hooks/use-analytics-filters";
import { useAnalyticsData } from "./hooks/use-analytics-data";
import { usePostAnalytics } from "./hooks/use-post-analytics";

import AnalyticsHeader from "./components/analytics-header";
import AnalyticsFilters from "./components/analytics-filters";
import MetricCard from "./components/metric-card";
import MetricChart from "./components/metric-chart";
import AnalyticsSkeleton from "./components/analytics-skeleton";
import AnalyticsError from "./components/analytics-error";
import TopPerformingContent from "./components/top-performing-content";
import ContentList from "./components/content-list";
import type { AnalyticsMetric } from "@/lib/types/analytics";
import { BarChart3 } from "lucide-react";

const METRIC_ORDER = [
  "follower_count",
  "impressions",
  "reach",
  "profile_views",
];

function sortMetricsByOrder(metrics: AnalyticsMetric[]) {
  return [...metrics].sort((a, b) => {
    const indexA = METRIC_ORDER.indexOf(a.key);
    const indexB = METRIC_ORDER.indexOf(b.key);

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });
}

export default function AnalyticsContainer() {
  const filters = useAnalyticsFilters();
  const { metrics, isLoading, isError, error, refetch } = useAnalyticsData({
    integrationId: filters.selectedIntegrationId,
    days: filters.selectedDays,
  });

  const {
    topPosts,
    posts,
    isLoading: isLoadingPosts,
  } = usePostAnalytics({
    integrationId: filters.selectedIntegrationId,
    limit: 12,
  });

  if (filters.isLoadingIntegrations || (isLoading && !metrics.length)) {
    return <AnalyticsSkeleton />;
  }

  if (isError) {
    return (
      <AnalyticsError
        error={error}
        onRetry={refetch}
        integrationId={filters.selectedIntegrationId}
      />
    );
  }

  if (!filters.isLoadingIntegrations && filters.integrations.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-[#fdfbf7]">
        <div className="max-w-md space-y-6 p-8 border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-muted">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-foreground">
              Connect Instagram
            </h2>
            <p className="font-serif text-sm text-muted-foreground leading-relaxed">
              Connect your Instagram account in Settings to view analytics data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sortedMetrics = sortMetricsByOrder(metrics);

  return (
    <div className="flex h-full w-full flex-col p-4 2xl:p-6 overflow-y-auto bg-[#fdfbf7]">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <AnalyticsHeader onRefresh={refetch} />

        <AnalyticsFilters
          integrations={filters.integrations}
          selectedIntegrationId={filters.selectedIntegrationId}
          onIntegrationChange={filters.setSelectedIntegrationId}
          selectedDays={filters.selectedDays}
          onDaysChange={filters.setSelectedDays}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
          {sortedMetrics.map((metric) => (
            <MetricCard key={metric.key} metric={metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {sortedMetrics.map((metric) => (
            <MetricChart key={metric.key} metric={metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-8">
          <div className="xl:col-span-1">
            <TopPerformingContent posts={topPosts} isLoading={isLoadingPosts} />
          </div>

          <div className="xl:col-span-2">
            <ContentList posts={posts} isLoading={isLoadingPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
