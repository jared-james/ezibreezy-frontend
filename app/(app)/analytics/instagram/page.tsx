"use client";

import { useState, useEffect } from "react";
import { useAnalyticsFilters } from "@/components/analytics/hooks/use-analytics-filters";
import { useAggregatedAnalytics } from "@/components/analytics/hooks/use-aggregated-analytics";
import { useUnifiedPostAnalytics } from "@/components/analytics/hooks/use-unified-post-analytics";

import AnalyticsHeader from "@/components/analytics/components/analytics-header";
import AnalyticsTabs from "@/components/analytics/components/analytics-tabs";
import AnalyticsFilters from "@/components/analytics/components/analytics-filters";
import MetricCard from "@/components/analytics/components/metric-card";
import MetricChart from "@/components/analytics/components/metric-chart";
import TopPerformingContent from "@/components/analytics/components/top-performing-content";
import ContentList from "@/components/analytics/components/content-list";
import AnalyticsSkeleton from "@/components/analytics/components/analytics-skeleton";
import { Instagram, MousePointer2, Users2, Eye } from "lucide-react";

export default function InstagramAnalyticsPage() {
  const filters = useAnalyticsFilters();
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>("reach");
  const [chartGranularity, setChartGranularity] = useState<"daily" | "weekly">(
    "daily"
  );

  const instagramPlatform = filters.platforms.find((p) => p.id === "instagram");
  const instagramAccounts = instagramPlatform ? instagramPlatform.accounts : [];

  const activeId = filters.activeAccountId;
  const targetAccount = instagramAccounts.find((a) => a.id === activeId);

  useEffect(() => {
    if (instagramAccounts.length > 0) {
      if (!targetAccount) {
        filters.setSingleAccount("instagram", instagramAccounts[0].id);
      }
    }
  }, [instagramAccounts, targetAccount, filters]);

  const targetAccountsArray = targetAccount
    ? [targetAccount]
    : instagramAccounts.length > 0
    ? [instagramAccounts[0]]
    : [];

  const {
    totalAudience,
    totalReach,
    totalImpressions,
    totalEngagement,
    profileViews,
    accountsEngaged,
    websiteClicks,
    isLoading,
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

  // Map keys to metric objects for the Chart to use
  const metricsMap = {
    total_audience: totalAudience.metric,
    reach: totalReach.metric,
    profile_views: profileViews.metric, // Swapped Impressions for Profile Views
    impressions: totalImpressions.metric,
    total_engagement: totalEngagement.metric,
  };

  const activeMetric =
    metricsMap[selectedMetricKey as keyof typeof metricsMap] ||
    totalReach.metric;

  if (
    filters.isLoadingIntegrations ||
    (isLoading && !totalReach.metric.currentValue)
  ) {
    return <AnalyticsSkeleton />;
  }

  if (instagramAccounts.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-[#f4f4f0]">
        <div className="max-w-md space-y-6 p-8 border-[3px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-pink-50 text-pink-600">
            <Instagram className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-foreground">
              No Signal
            </h2>
            <p className="font-serif text-sm text-muted-foreground leading-relaxed">
              No Instagram accounts connected. Connect an account in Settings to
              view this frequency.
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
          platforms={instagramPlatform ? [instagramPlatform] : []}
          selectedAccounts={filters.selectedAccounts}
          activeAccountId={targetAccountsArray[0]?.id || null}
          onAccountClick={filters.setSingleAccount}
          selectedDays={filters.selectedDays}
          onDaysChange={filters.setSelectedDays}
        />

        {/* Top Grid: Promoted Profile Views to the 3rd slot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
          <MetricCard
            metric={{ ...totalAudience.metric, label: "Followers" }}
            isSelected={selectedMetricKey === "total_audience"}
            onClick={() => setSelectedMetricKey("total_audience")}
            loading={totalAudience.isLoading}
          />
          <MetricCard
            metric={totalReach.metric}
            isSelected={selectedMetricKey === "reach"}
            onClick={() => setSelectedMetricKey("reach")}
            loading={totalReach.isLoading}
          />
          {/* Swapped Impressions for Profile Views here */}
          <MetricCard
            metric={profileViews.metric}
            isSelected={selectedMetricKey === "profile_views"}
            onClick={() => setSelectedMetricKey("profile_views")}
            loading={profileViews.isLoading}
          />
          <MetricCard
            metric={{ ...totalEngagement.metric, label: "Engagement" }}
            isSelected={selectedMetricKey === "total_engagement"}
            onClick={() => setSelectedMetricKey("total_engagement")}
            loading={totalEngagement.isLoading}
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
            Platform Specifics // Instagram
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-dashed border-border bg-surface/30 rounded-sm flex items-center gap-4">
              <div className="p-2 bg-pink-50 text-pink-600 rounded-full">
                <Users2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">
                  {accountsEngaged.metric.currentValue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Accounts Engaged
                </div>
              </div>
            </div>
            {/* Moved Impressions (Views) down to here */}
            <div className="p-4 border border-dashed border-border bg-surface/30 rounded-sm flex items-center gap-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-full">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">
                  {totalImpressions.metric.currentValue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Impressions
                </div>
              </div>
            </div>
            <div className="p-4 border border-dashed border-border bg-surface/30 rounded-sm flex items-center gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                <MousePointer2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">
                  {websiteClicks.metric.currentValue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Website Clicks
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
              label="Top Posts"
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
