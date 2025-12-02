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
 * Account for analytics selection
 */
export interface Account {
  id: string;
  name: string;
  img: string;
}

/**
 * Analytics platform with accounts for selection
 */
export interface AnalyticsPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  accounts: Account[];
}

/**
 * Filter state for analytics dashboard (v2 with multi-select)
 */
export interface AnalyticsFilters {
  selectedAccounts: Record<string, string[]>;
  activeAccountId: string | null;
  days: TimeRange;
  version: 2;
}

/**
 * Legacy filter state (v1, deprecated)
 * @deprecated Use AnalyticsFilters (v2)
 */
export interface LegacyAnalyticsFilters {
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
  // YouTube-specific metrics (optional, only present for YouTube videos)
  watchTimeMinutes?: number;
  avgViewDuration?: number; // in seconds
  avgViewPercentage?: number; // percentage (0-100)
  subscribersGained?: number;
  subscribersLost?: number;
  subscribersNet?: number;
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
