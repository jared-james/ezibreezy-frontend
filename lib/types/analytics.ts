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
 * Used for Account Analytics charts.
 */
export interface AnalyticsMetric {
  label: string; // Human-readable label (e.g., "Followers")
  key: string; // API key (e.g., "followers")
  currentValue: number; // Most recent metric value
  percentageChange?: number; // % change vs previous period
  history: DailyMetric[]; // Daily historical data for charting
}

/**
 * Supported time range options
 */
export type TimeRange = 7 | 14 | 30 | 60 | 90;

/**
 * Account connection status
 */
export type AccountStatus = "active" | "error" | "reauth_required" | "syncing";

/**
 * Account for analytics selection
 */
export interface Account {
  id: string;
  name: string;
  img: string;
  status?: AccountStatus; // Added: Health state of the connection
  errorMessage?: string; // Added: Reason for error (e.g., "100 followers required")
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
 * Filter state for analytics dashboard
 */
export interface AnalyticsFilters {
  selectedAccounts: Record<string, string[]>;
  activeAccountId: string | null;
  days: TimeRange;
  version: 2;
}

/**
 * Platform-specific additional metrics (e.g. YouTube Watch Time)
 */
export interface PlatformSpecificMetrics {
  watchTimeMinutes?: number;
  avgViewDuration?: number; // in seconds
  avgViewPercentage?: number; // percentage (0-100)
  subscribersGained?: number;
  subscribersLost?: number;
  subscribersNet?: number;
  [key: string]: any;
}

/**
 * Individual post analytics with flattened performance metrics.
 */
export interface PostAnalytics {
  id: string;
  platformId: string;
  type: "image" | "video" | "carousel" | "story" | "text";
  thumbnailUrl: string;
  permalink: string;
  caption: string;
  postedAt: string; // ISO Date String

  // Standard First-Class Metrics
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;

  // Platform-specific extras
  metrics?: PlatformSpecificMetrics;
}

/**
 * Analytics error/warning types from backend
 */
export type AnalyticsErrorType =
  | "TOKEN_EXPIRED"
  | "INSUFFICIENT_PERMISSIONS"
  | "REQUIREMENTS_NOT_MET"
  | "RATE_LIMIT"
  | "PLATFORM_ERROR"
  | "PARTIAL_DATA"
  | "UNKNOWN";

/**
 * Warning severity levels
 */
export type WarningSeverity = "info" | "warning" | "error";

/**
 * Analytics warning structure
 */
export interface AnalyticsWarning {
  code: AnalyticsErrorType;
  message: string;
  severity: WarningSeverity;
  metadata?: {
    metricName?: string;
    requirement?: string;
    retryAfter?: string;
    missingMetrics?: string[];
    postId?: string;
    reason?: string;
    [key: string]: any;
  };
}

/**
 * Data quality status
 */
export type DataQualityStatus = "complete" | "partial" | "stale" | "cached_error";

/**
 * Data quality metadata
 */
export interface DataQualityMetadata {
  status: DataQualityStatus;
  lastSuccessfulFetch?: string;
  cacheAge?: number;
  missingMetrics?: string[];
}

/**
 * Analytics response wrapper with warnings and data quality info
 */
export interface AnalyticsResponse<T> {
  data: T;
  warnings?: AnalyticsWarning[];
  dataQuality?: DataQualityMetadata;
}
