// components/analytics/hooks/use-analytics-data.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api/analytics";
import type { AnalyticsMetric, TimeRange } from "@/lib/types/analytics";

interface UseAnalyticsDataProps {
  integrationId: string | null;
  days: TimeRange;
}

interface UseAnalyticsDataReturn {
  metrics: AnalyticsMetric[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

export function useAnalyticsData({
  integrationId,
  days,
}: UseAnalyticsDataProps): UseAnalyticsDataReturn {
  const {
    data: metrics = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AnalyticsMetric[]>({
    queryKey: ["analytics", integrationId, days],
    queryFn: () => getAnalytics(integrationId!, days),
    enabled: !!integrationId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    metrics,
    isLoading,
    isError,
    error,
    refetch,
  };
}
