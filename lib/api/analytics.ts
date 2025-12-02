import apiClient from "./index";
import type {
  AnalyticsMetric,
  TimeRange,
  PostAnalytics,
  AnalyticsResponse,
} from "@/lib/types/analytics";

export const getAnalytics = async (
  integrationId: string,
  days: TimeRange = 7
): Promise<AnalyticsResponse<AnalyticsMetric[]>> => {
  try {
    const response = await apiClient.get<AnalyticsResponse<AnalyticsMetric[]>>(
      "/analytics",
      {
        params: { integrationId, days },
      }
    );
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
): Promise<AnalyticsResponse<PostAnalytics[]>> => {
  try {
    const response = await apiClient.get<AnalyticsResponse<PostAnalytics[]>>(
      "/analytics/posts",
      {
        params: { integrationId, limit, offset },
      }
    );
    return response.data;
  } catch (error) {
    console.error("[Analytics API] Error fetching post analytics", error);
    throw error;
  }
};
