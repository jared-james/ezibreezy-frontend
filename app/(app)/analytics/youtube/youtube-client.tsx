// app/(app)/analytics/youtube/youtube-client.tsx

"use client";

import { useState, useEffect } from "react";
import { useAnalyticsFilters } from "@/components/analytics/hooks/use-analytics-filters";
import { useAggregatedAnalytics } from "@/components/analytics/hooks/use-aggregated-analytics";
import { useUnifiedPostAnalytics } from "@/components/analytics/hooks/use-unified-post-analytics";
import { useAnalyticsData } from "@/components/analytics/hooks/use-analytics-data";
import { usePostAnalytics } from "@/components/analytics/hooks/use-post-analytics";

import AnalyticsHeader from "@/components/analytics/components/analytics-header";
import AnalyticsTabs from "@/components/analytics/components/analytics-tabs";
import AnalyticsFilters from "@/components/analytics/components/analytics-filters";
import MetricCard from "@/components/analytics/components/metric-card";
import MetricChart from "@/components/analytics/components/metric-chart";
import TopPerformingContent from "@/components/analytics/components/top-performing-content";
import ContentList from "@/components/analytics/components/content-list";
import AnalyticsSkeleton from "@/components/analytics/components/analytics-skeleton";
import { Youtube, Clock, PlayCircle, Users } from "lucide-react";

interface YoutubeClientProps {
  workspaceId: string;
}

export default function YoutubeClient({ workspaceId }: YoutubeClientProps) {
  const filters = useAnalyticsFilters();
  const [selectedMetricKey, setSelectedMetricKey] =
    useState<string>("total_exposure");
  const [chartGranularity, setChartGranularity] = useState<"daily" | "weekly">(
    "daily"
  );

  const youtubePlatform = filters.platforms.find((p) => p.id === "youtube");
  const youtubeAccounts = youtubePlatform ? youtubePlatform.accounts : [];

  const activeId = filters.activeAccountId;
  const targetAccount = youtubeAccounts.find((a) => a.id === activeId);

  useEffect(() => {
    if (youtubeAccounts.length > 0) {
      if (!targetAccount) {
        filters.setSingleAccount("youtube", youtubeAccounts[0].id);
      }
    }
  }, [youtubeAccounts, targetAccount, filters]);

  // --- FORCE DATA FETCHING ---

  // 1. Fetch Account Data (Subscribers, Views over time)
  useAnalyticsData({
    integrationId: activeId,
    days: filters.selectedDays,
  });

  // 2. Fetch Video Data (Specific video metrics)
  // This triggers /analytics/posts -> which hits the YouTube API -> which prints your logs
  usePostAnalytics({
    integrationId: activeId,
    limit: 10,
  });

  // ---------------------------

  const targetAccountsArray = targetAccount
    ? [targetAccount]
    : youtubeAccounts.length > 0
    ? [youtubeAccounts[0]]
    : [];

  const {
    totalAudience,
    totalExposure,
    totalEngagement,
    globalEngagementRate,
    // New YouTube Metrics
    watchTimeMinutes,
    subscribersGained,
    avgViewDuration,
  } = useAggregatedAnalytics({
    accounts: targetAccountsArray,
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
    accounts: targetAccountsArray,
    limit: 12,
  });

  const metricsMap = {
    total_audience: totalAudience.metric,
    total_exposure: totalExposure.metric,
    total_engagement: totalEngagement.metric,
    global_engagement_rate: globalEngagementRate.metric,
  };
  const activeMetric =
    metricsMap[selectedMetricKey as keyof typeof metricsMap] ||
    totalExposure.metric;

  if (
    filters.isLoadingIntegrations ||
    (!totalExposure.metric.currentValue && totalExposure.isLoading)
  ) {
    return <AnalyticsSkeleton />;
  }

  if (youtubeAccounts.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-[#f4f4f0]">
        <div className="max-w-md space-y-6 p-8 border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-red-50 text-red-600">
            <Youtube className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-foreground">
              Signal Lost
            </h2>
            <p className="font-serif text-sm text-muted-foreground leading-relaxed">
              No YouTube channels connected. Connect a channel in Settings to
              receive broadcast data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-10">
        <AnalyticsHeader />

        <AnalyticsTabs />

        <AnalyticsFilters
          showAccountSelector={true}
          selectionMode="single"
          platforms={youtubePlatform ? [youtubePlatform] : []}
          selectedAccounts={filters.selectedAccounts}
          activeAccountId={targetAccountsArray[0]?.id || null}
          onAccountClick={filters.setSingleAccount}
          selectedDays={filters.selectedDays}
          onDaysChange={filters.setSelectedDays}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
          <MetricCard
            metric={{ ...totalAudience.metric, label: "Total Subscribers" }}
            isSelected={selectedMetricKey === "total_audience"}
            onClick={() => setSelectedMetricKey("total_audience")}
            loading={totalAudience.isLoading}
          />
          <MetricCard
            metric={{ ...totalExposure.metric, label: "Total Views" }}
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

        <div className="py-2">
          <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Platform Specifics // YouTube
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Watch Time */}
            <div className="p-4 border border-dashed border-border bg-surface/30 rounded-sm flex items-center gap-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-full">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">
                  {watchTimeMinutes?.metric?.currentValue?.toLocaleString() ??
                    "0"}{" "}
                  Min
                </div>
                <div className="text-xs text-muted-foreground">Watch Time</div>
              </div>
            </div>

            {/* Avg Duration */}
            <div className="p-4 border border-dashed border-border bg-surface/30 rounded-sm flex items-center gap-4">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-full">
                <PlayCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">
                  {avgViewDuration?.metric?.currentValue?.toFixed(0) ?? "0"}s
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg Duration
                </div>
              </div>
            </div>

            {/* Subscriber Net */}
            <div className="p-4 border border-dashed border-border bg-surface/30 rounded-sm flex items-center gap-4">
              <div className="p-2 bg-green-50 text-green-600 rounded-full">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">
                  {subscribersGained?.metric?.currentValue > 0 ? "+" : ""}
                  {subscribersGained?.metric?.currentValue ?? 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Subscribers Gained
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="w-full border-t border-dashed border-foreground/30" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
          <div className="xl:col-span-1">
            <TopPerformingContent
              posts={topPosts}
              isLoading={isLoadingPosts}
              label="Top Videos"
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
      </div>
    </div>
  );
}
