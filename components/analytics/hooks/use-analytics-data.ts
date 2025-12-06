// components/analytics/hooks/use-analytics-data.ts

"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsAction } from "@/app/actions/analytics";
import { useParams } from "next/navigation";
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
  const params = useParams();
  const workspaceId = params.workspace as string;

  const { data, isLoading, isError, error, refetch } = useQuery<
    AnalyticsResponse<AnalyticsMetric[]>
  >({
    queryKey: ["analytics", integrationId, days, workspaceId],
    queryFn: async () => {
      const result = await getAnalyticsAction(integrationId!, days, workspaceId);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch analytics");
      }
      return result.data;
    },
    enabled: !!integrationId && !!workspaceId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

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
