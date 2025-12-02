// lib/api/analytics.ts

import apiClient from "./index";
import type {
  AnalyticsMetric,
  TimeRange,
  PostAnalytics,
} from "@/lib/types/analytics";

/**
 * Fetches analytics data for a specific integration
 * @param integrationId - UUID of the Instagram integration
 * @param days - Number of days to fetch (default 7, max 90)
 * @returns Array of analytics metrics
 */
export const getAnalytics = async (
  integrationId: string,
  days: TimeRange = 7
): Promise<AnalyticsMetric[]> => {
  console.log(
    `[Analytics API] Fetching analytics for integration ${integrationId}, days: ${days}`
  );

  try {
    const response = await apiClient.get<AnalyticsMetric[]>("/analytics", {
      params: { integrationId, days },
    });

    console.log(
      `[Analytics API] Success: Received ${response.data.length} metrics`
    );
    return response.data;
  } catch (error) {
    const errorObj = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
    console.error("[Analytics API] Error:", {
      status: errorObj.response?.status,
      message: errorObj.response?.data?.message || errorObj.message,
      integrationId,
      days,
    });
    throw error;
  }
};

/**
 * Fetches post analytics for a specific integration
 * @param integrationId - UUID of the Instagram integration
 * @param limit - Number of posts to fetch (default 10, max 50)
 * @returns Array of post analytics with performance metrics
 */
export const getPostAnalytics = async (
  integrationId: string,
  limit: number = 10
): Promise<PostAnalytics[]> => {
  console.log(
    `[Analytics API] Fetching post analytics for integration ${integrationId}, limit: ${limit}`
  );

  try {
    const response = await apiClient.get<PostAnalytics[]>("/analytics/posts", {
      params: { integrationId, limit },
    });

    console.log(
      `[Analytics API] Success: Received ${response.data.length} posts`
    );
    return response.data;
  } catch (error) {
    const errorObj = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
    console.error("[Analytics API - Posts] Error:", {
      status: errorObj.response?.status,
      message: errorObj.response?.data?.message || errorObj.message,
      integrationId,
      limit,
    });
    throw error;
  }
};
