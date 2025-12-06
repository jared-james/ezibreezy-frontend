// components/analytics/hooks/use-aggregated-analytics.ts

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAggregatedAnalyticsAction } from "@/app/actions/analytics";
import { useParams } from "next/navigation";
import type {
  AnalyticsMetric,
  TimeRange,
  Account,
} from "@/lib/types/analytics";

interface UseAggregatedAnalyticsProps {
  accounts: Account[];
  days: TimeRange;
}

interface AggregatedMetricResult {
  metric: AnalyticsMetric;
  isLoading: boolean;
}

interface AggregatedData {
  totalAudience: AggregatedMetricResult;
  totalExposure: AggregatedMetricResult;
  totalEngagement: AggregatedMetricResult;
  globalEngagementRate: AggregatedMetricResult;

  totalReach: AggregatedMetricResult;
  totalImpressions: AggregatedMetricResult;

  profileViews: AggregatedMetricResult;
  accountsEngaged: AggregatedMetricResult;
  websiteClicks: AggregatedMetricResult;

  // Instagram Breakdown
  feedViews: AggregatedMetricResult;
  reelsViews: AggregatedMetricResult;

  // YouTube Specifics -- ADDED THESE
  watchTimeMinutes: AggregatedMetricResult;
  subscribersGained: AggregatedMetricResult;
  avgViewDuration: AggregatedMetricResult;

  isLoading: boolean;
  errors: Error[];
}

export function useAggregatedAnalytics({
  accounts,
  days,
}: UseAggregatedAnalyticsProps): AggregatedData {
  const params = useParams();
  const workspaceId = params.workspace as string;
  const integrationIds = accounts.map((a) => a.id);
  const isEnabled = integrationIds.length > 0 && !!workspaceId;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["analytics", "aggregate", integrationIds, days, workspaceId],
    queryFn: async () => {
      const result = await getAggregatedAnalyticsAction(integrationIds, days, workspaceId);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch aggregated analytics");
      }
      return result.data;
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const metrics = response?.data || [];

  // Helper to safely find a metric or return a zero-state placeholder
  const getMetric = (
    key: string,
    fallbackLabel: string
  ): AggregatedMetricResult => {
    const found = metrics.find((m) => m.key === key);
    return {
      isLoading,
      metric: found || {
        key,
        label: fallbackLabel,
        currentValue: 0,
        history: [],
      },
    };
  };

  // 1. Engagement Rate Calculation
  const engagementMetric = getMetric("engagement_count", "Engagement").metric;
  const reachMetric = getMetric("reach", "Reach").metric;

  const engagementValue = engagementMetric.currentValue;
  const reachValue = reachMetric.currentValue || 1;

  const calculatedRate = (engagementValue / reachValue) * 100;

  const globalEngagementRate: AggregatedMetricResult = {
    isLoading,
    metric: {
      key: "global_engagement_rate",
      label: "Avg Engagement Rate",
      currentValue: calculatedRate,
      history: [],
    },
  };

  return {
    isLoading,
    errors: error ? [error as Error] : [],

    // Overview
    totalAudience: getMetric("total_audience", "Total Audience"),
    totalExposure: getMetric("impressions", "Total Views"),
    totalEngagement: { isLoading, metric: engagementMetric },
    globalEngagementRate,

    // Specifics
    totalReach: { isLoading, metric: reachMetric },
    totalImpressions: getMetric("impressions", "Views"),

    // Platform Specifics
    profileViews: getMetric("profile_views", "Profile Views"),
    accountsEngaged: getMetric("accounts_engaged", "Accounts Engaged"),
    websiteClicks: getMetric("website_clicks", "Website Clicks"),

    // Content Type Breakdown (Instagram)
    feedViews: getMetric("feed_views", "Feed Views"),
    reelsViews: getMetric("reels_views", "Reels Views"),

    // YouTube Specifics -- MAPPED HERE
    watchTimeMinutes: getMetric("watch_time_minutes", "Watch Time"),
    subscribersGained: getMetric("subscribers_gained", "Subs Gained"),
    avgViewDuration: getMetric("avg_view_duration", "Avg Duration"),
  };
}
