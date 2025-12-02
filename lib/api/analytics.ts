// lib/api/analytics.ts

import apiClient from "./index";
import type {
  AnalyticsMetric,
  TimeRange,
  PostAnalytics,
} from "@/lib/types/analytics";

export const getAnalytics = async (
  integrationId: string,
  days: TimeRange = 7
) => {
  try {
    const response = await apiClient.get("/analytics", {
      params: { integrationId, days },
    });
    return response.data;
  } catch (error) {
    console.error("[Analytics API] Error fetching account analytics", error);
    throw error;
  }
};

export const getPostAnalytics = async (
  integrationId: string,
  limit: number = 10,
  offset: number = 0
): Promise<PostAnalytics[]> => {
  try {
    const response = await apiClient.get<PostAnalytics[]>("/analytics/posts", {
      params: { integrationId, limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error("[Analytics API] Error fetching post analytics", error);
    throw error;
  }
};
