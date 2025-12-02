// lib/types/analytics.ts

/**
 * Represents a single data point in the time series
 */
export interface DailyMetric {
  date: string; // "YYYY-MM-DD" format
  value: number;
}

/**
 * Complete analytics metric with current value, trend, and history
 */
export interface AnalyticsMetric {
  label: string; // Human-readable label (e.g., "Followers")
  key: string; // API key (e.g., "follower_count")
  currentValue: number; // Most recent metric value
  percentageChange?: number; // % change vs previous period (can be negative)
  history: DailyMetric[]; // Daily historical data for charting
}

/**
 * Supported time range options
 */
export type TimeRange = 7 | 14 | 30 | 60 | 90;

/**
 * Filter state for analytics dashboard
 */
export interface AnalyticsFilters {
  integrationId: string;
  days: TimeRange;
}

/**
 * Metrics for individual post performance
 */
export interface PostMetrics {
  likes: number;
  comments: number;
  shares: number; // Often 0 due to API privacy restrictions
  saves: number;
  impressions: number;
  reach: number;
  engagementRate: number; // Calculated as: ((Likes + Comments + Saves) / Reach) * 100
}

/**
 * Individual post analytics with performance metrics
 */
export interface PostAnalytics {
  id: string; // Instagram Media ID
  platformId: string; // Same as ID for Instagram
  type: "image" | "video" | "carousel_album" | "story";
  thumbnailUrl: string;
  permalink: string; // Link to the post on Instagram
  caption: string;
  postedAt: string; // ISO Date String
  metrics: PostMetrics;
}
