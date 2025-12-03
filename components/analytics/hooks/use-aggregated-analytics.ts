// components/analytics/hooks/use-aggregated-analytics.ts

import { useQueries } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api/analytics";
import type {
  AnalyticsMetric,
  DailyMetric,
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
  // Generic / Overview Metrics
  totalAudience: AggregatedMetricResult;
  totalExposure: AggregatedMetricResult;
  totalEngagement: AggregatedMetricResult;
  globalEngagementRate: AggregatedMetricResult;

  // Specific Breakdown Metrics (for platform pages)
  totalReach: AggregatedMetricResult;
  totalImpressions: AggregatedMetricResult;

  // Platform Specifics (Instagram)
  profileViews: AggregatedMetricResult;
  accountsEngaged: AggregatedMetricResult;
  websiteClicks: AggregatedMetricResult;

  isLoading: boolean;
  errors: Error[];
}

// Define which metrics should be summed up (Accumulative) vs taken as latest value (Snapshot)
const SNAPSHOT_METRICS = ["followers", "subscribers"];

function calculateMetricTotal(metric: AnalyticsMetric): number {
  if (SNAPSHOT_METRICS.includes(metric.key)) {
    return metric.currentValue;
  }
  // For Reach, Views, Engagement, etc., sum the history
  return metric.history.reduce((sum, day) => sum + day.value, 0);
}

export function useAggregatedAnalytics({
  accounts,
  days,
}: UseAggregatedAnalyticsProps): AggregatedData {
  // 1. Fetch data for ALL active accounts in parallel
  const queries = useQueries({
    queries: accounts.map((account) => ({
      queryKey: ["analytics", account.id, days],
      queryFn: () => getAnalytics(account.id, days),
      enabled: !!account.id && account.status !== "error",
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });

  const isLoading = queries.some(
    (q) => q.isLoading && q.fetchStatus !== "idle"
  );
  const errors = queries.map((q) => q.error).filter(Boolean) as Error[];

  // 2. Initialize Maps
  const historyMaps = {
    audience: new Map<string, number>(),
    exposure: new Map<string, number>(),
    engagement: new Map<string, number>(),

    // Specifics
    reach: new Map<string, number>(),
    impressions: new Map<string, number>(),
    profileViews: new Map<string, number>(),
    accountsEngaged: new Map<string, number>(),
    websiteClicks: new Map<string, number>(),
  };

  const totals = {
    audience: 0,
    exposure: 0,
    engagement: 0,
    reach: 0,
    impressions: 0,
    profileViews: 0,
    accountsEngaged: 0,
    websiteClicks: 0,
  };

  // 3. Process Results
  queries.forEach((query, index) => {
    if (!query.data?.data) return;

    const metrics = query.data.data;
    const accountName = accounts[index]?.name || "Unknown Account";

    // --- LOGGING START ---
    console.groupCollapsed(`[Analytics Hook] Processing: ${accountName}`);

    const getMetric = (keys: string[]) =>
      metrics.find((m) => keys.includes(m.key));

    // A. Audience (Snapshot - usually followers)
    const audienceMetric = getMetric(["followers", "subscribers"]);
    if (audienceMetric) {
      const val = calculateMetricTotal(audienceMetric);
      totals.audience += val;
      mergeHistory(audienceMetric.history, historyMaps.audience);
    }

    // B. Exposure (Generic - Accumulative)
    const exposureMetric = getMetric(["reach", "views"]);
    if (exposureMetric) {
      const val = calculateMetricTotal(exposureMetric);
      totals.exposure += val;
      mergeHistory(exposureMetric.history, historyMaps.exposure);
    }

    // C. Engagement (Accumulative)
    const engagementMetric = getMetric([
      "engagement_count",
      "total_interactions",
    ]);
    if (engagementMetric) {
      const val = calculateMetricTotal(engagementMetric);
      totals.engagement += val;
      mergeHistory(engagementMetric.history, historyMaps.engagement);
    }

    // D. Specifics - Reach
    const reachMetric = getMetric(["reach"]);
    if (reachMetric) {
      const val = calculateMetricTotal(reachMetric);
      console.log(
        `-> Reach: Latest=${reachMetric.currentValue}, SumHistory=${val}`
      );
      totals.reach += val;
      mergeHistory(reachMetric.history, historyMaps.reach);
    }

    // E. Specifics - Impressions (Views)
    const impMetric = getMetric(["impressions", "views"]);
    if (impMetric) {
      const val = calculateMetricTotal(impMetric);
      totals.impressions += val;
      mergeHistory(impMetric.history, historyMaps.impressions);
    }

    // F. Platform Specifics (Instagram)
    const pvMetric = getMetric(["profile_views"]);
    if (pvMetric) {
      const val = calculateMetricTotal(pvMetric);
      totals.profileViews += val;
      mergeHistory(pvMetric.history, historyMaps.profileViews);
    }

    const aeMetric = getMetric(["accounts_engaged"]);
    if (aeMetric) {
      const val = calculateMetricTotal(aeMetric);
      totals.accountsEngaged += val;
      mergeHistory(aeMetric.history, historyMaps.accountsEngaged);
    }

    const wcMetric = getMetric(["website_clicks", "profile_links_taps"]);
    if (wcMetric) {
      const val = calculateMetricTotal(wcMetric);
      totals.websiteClicks += val;
      mergeHistory(wcMetric.history, historyMaps.websiteClicks);
    }

    console.groupEnd();
  });

  // 4. Calculate Global Rate (Exposure Weighted)
  // Now totals.exposure is the SUM of reach over 30 days, not just today's snapshot.
  const exposureDenominator = totals.exposure || 1;
  const currentGlobalRate = (totals.engagement / exposureDenominator) * 100;

  // Calculate Historical Rate
  const rateHistoryMap = new Map<string, number>();
  const allDates = new Set([
    ...historyMaps.exposure.keys(),
    ...historyMaps.engagement.keys(),
  ]);

  allDates.forEach((date) => {
    const dailyExp = historyMaps.exposure.get(date) || 0;
    const dailyEng = historyMaps.engagement.get(date) || 0;
    const dailyRate = dailyExp > 0 ? (dailyEng / dailyExp) * 100 : 0;
    rateHistoryMap.set(date, dailyRate);
  });

  // 5. Convert Maps to Sorted Arrays
  const audienceHistory = mapToSortedArray(historyMaps.audience);
  const exposureHistory = mapToSortedArray(historyMaps.exposure);
  const engagementHistory = mapToSortedArray(historyMaps.engagement);
  const rateHistory = mapToSortedArray(rateHistoryMap);

  const reachHistory = mapToSortedArray(historyMaps.reach);
  const impressionsHistory = mapToSortedArray(historyMaps.impressions);
  const pvHistory = mapToSortedArray(historyMaps.profileViews);
  const aeHistory = mapToSortedArray(historyMaps.accountsEngaged);
  const wcHistory = mapToSortedArray(historyMaps.websiteClicks);

  return {
    isLoading,
    errors,
    totalAudience: {
      isLoading,
      metric: {
        key: "total_audience",
        label: "Total Audience",
        currentValue: totals.audience,
        history: audienceHistory,
      },
    },
    totalExposure: {
      isLoading,
      metric: {
        key: "total_exposure",
        label: "Total Views",
        currentValue: totals.exposure,
        history: exposureHistory,
      },
    },
    totalEngagement: {
      isLoading,
      metric: {
        key: "total_engagement",
        label: "Total Engagements",
        currentValue: totals.engagement,
        history: engagementHistory,
      },
    },
    globalEngagementRate: {
      isLoading,
      metric: {
        key: "global_engagement_rate",
        label: "Avg Engagement Rate",
        currentValue: currentGlobalRate,
        history: rateHistory,
      },
    },
    // Specifics
    totalReach: {
      isLoading,
      metric: {
        key: "reach",
        label: "Reach",
        currentValue: totals.reach,
        history: reachHistory,
      },
    },
    totalImpressions: {
      isLoading,
      metric: {
        key: "impressions",
        label: "Views",
        currentValue: totals.impressions,
        history: impressionsHistory,
      },
    },
    profileViews: {
      isLoading,
      metric: {
        key: "profile_views",
        label: "Profile Views",
        currentValue: totals.profileViews,
        history: pvHistory,
      },
    },
    accountsEngaged: {
      isLoading,
      metric: {
        key: "accounts_engaged",
        label: "Accounts Engaged",
        currentValue: totals.accountsEngaged,
        history: aeHistory,
      },
    },
    websiteClicks: {
      isLoading,
      metric: {
        key: "website_clicks",
        label: "Website Clicks",
        currentValue: totals.websiteClicks,
        history: wcHistory,
      },
    },
  };
}

function mergeHistory(history: DailyMetric[], targetMap: Map<string, number>) {
  if (!history) return;
  history.forEach((point) => {
    const current = targetMap.get(point.date) || 0;
    targetMap.set(point.date, current + point.value);
  });
}

function mapToSortedArray(map: Map<string, number>): DailyMetric[] {
  return Array.from(map.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
