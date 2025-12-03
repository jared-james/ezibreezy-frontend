// components/analytics/hooks/use-analytics-data.ts

"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api/analytics";
import type {
  AnalyticsMetric,
  TimeRange,
  AnalyticsResponse,
  AnalyticsWarning,
  DataQualityMetadata,
} from "@/lib/types/analytics";

interface UseAnalyticsDataProps {
  integrationId: string | null;
  days: TimeRange;
}

interface UseAnalyticsDataReturn {
  metrics: AnalyticsMetric[];
  warnings?: AnalyticsWarning[];
  dataQuality?: DataQualityMetadata;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

export function useAnalyticsData({
  integrationId,
  days,
}: UseAnalyticsDataProps): UseAnalyticsDataReturn {
  const { data, isLoading, isError, error, refetch } = useQuery<
    AnalyticsResponse<AnalyticsMetric[]>
  >({
    queryKey: ["analytics", integrationId, days],
    queryFn: () => getAnalytics(integrationId!, days),
    enabled: !!integrationId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // --- DEBUGGING START ---
  useEffect(() => {
    if (data) {
      console.group("🎥 [YouTube] Analytics Data");
      console.log("Integration ID:", integrationId);
      console.log("Days:", days);
      console.log("Raw Response:", data);
      console.log("Metrics:", data.data);
      console.log("Warnings:", data.warnings);
      console.log("Data Quality:", data.dataQuality);
      console.groupEnd();
    }
    if (error) {
      console.error("❌ [YouTube] Analytics Data Error:", error);
    }
  }, [data, error, integrationId, days]);
  // --- DEBUGGING END ---

  return {
    metrics: data?.data || [],
    warnings: data?.warnings,
    dataQuality: data?.dataQuality,
    isLoading,
    isError,
    error,
    refetch,
  };
}
