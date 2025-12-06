// app/actions/analytics.ts
"use server";

import { serverFetch } from "@/lib/api/server-fetch";
import type {
  AnalyticsMetric,
  TimeRange,
  PostAnalytics,
  AnalyticsResponse,
} from "@/lib/types/analytics";

export async function getAnalyticsAction(
  integrationId: string,
  days: TimeRange = 7,
  workspaceId: string
): Promise<{
  success: boolean;
  data?: AnalyticsResponse<AnalyticsMetric[]>;
  error?: string;
}> {
  const params = new URLSearchParams({
    integrationId,
    days: days.toString(),
  });

  return await serverFetch<AnalyticsResponse<AnalyticsMetric[]>>(
    `/analytics?${params.toString()}`,
    { workspaceId }
  );
}

export async function getPostAnalyticsAction(
  integrationId: string,
  limit: number = 10,
  offset: number = 0,
  workspaceId: string
): Promise<{
  success: boolean;
  data?: AnalyticsResponse<PostAnalytics[]>;
  error?: string;
}> {
  const params = new URLSearchParams({
    integrationId,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  return await serverFetch<AnalyticsResponse<PostAnalytics[]>>(
    `/analytics/posts?${params.toString()}`,
    { workspaceId }
  );
}

export async function getAggregatedAnalyticsAction(
  integrationIds: string[],
  days: TimeRange = 30,
  workspaceId: string
): Promise<{
  success: boolean;
  data?: AnalyticsResponse<AnalyticsMetric[]>;
  error?: string;
}> {
  const params = new URLSearchParams({
    integrationIds: integrationIds.join(","),
    days: days.toString(),
  });

  return await serverFetch<AnalyticsResponse<AnalyticsMetric[]>>(
    `/analytics/aggregate?${params.toString()}`,
    { workspaceId }
  );
}

export async function getAggregatedPostsAction(
  integrationIds: string[],
  limit: number = 12,
  offset: number = 0,
  workspaceId: string
): Promise<{
  success: boolean;
  data?: AnalyticsResponse<PostAnalytics[]>;
  error?: string;
}> {
  const params = new URLSearchParams({
    integrationIds: integrationIds.join(","),
    limit: limit.toString(),
    offset: offset.toString(),
  });

  return await serverFetch<AnalyticsResponse<PostAnalytics[]>>(
    `/analytics/posts/aggregate?${params.toString()}`,
    { workspaceId }
  );
}
