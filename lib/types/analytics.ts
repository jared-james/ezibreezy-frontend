// lib/types/analytics.ts

import type { ComponentType } from "react";

/**
 * Supported platforms for analytics
 */
export type PlatformType =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | "facebook";

/**
 * Represents a single data point in the time series
 */
export interface DailyMetric {
  date: string; // "YYYY-MM-DD" format
  value: number;
}

/**
 * Complete analytics metric with current value, trend, and history
 * Used for both individual account charts and aggregated overview charts.
 */
export interface AnalyticsMetric {
  label: string;
  key: string;
  currentValue: number;
  percentageChange?: number; // % change vs previous period
  history: DailyMetric[];
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
  username?: string; // Optional handle (e.g. @username)
  img: string;
  status?: AccountStatus;
  errorMessage?: string;
}

/**
 * Analytics platform wrapper
 */
export interface AnalyticsPlatform {
  id: PlatformType;
  name: string;
  icon: ComponentType<{ className?: string }>;
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
 * Platform-specific additional metrics
 * Used for the deep-dive pages.
 */
export interface PlatformSpecificMetrics {
  // YouTube specific
  watchTimeMinutes?: number;
  avgViewDuration?: number; // in seconds
  avgViewPercentage?: number; // percentage (0-100)
  subscribersGained?: number;
  subscribersLost?: number;
  subscribersNet?: number;

  // Instagram specific
  profile_views?: number;
  profile_links_taps?: number;
  accounts_engaged?: number;
  website_clicks?: number;

  [key: string]: any;
}

/**
 * Content types for filtering "The Wire"
 */
export type ContentType = "image" | "video" | "carousel" | "story" | "text";

/**
 * Individual post analytics with flattened performance metrics.
 */
export interface PostAnalytics {
  id: string;
  platformId: string;
  integrationId: string; // ID of the account connection
  platform: PlatformType; // 'instagram' | 'youtube' etc.

  type: ContentType;
  thumbnailUrl: string;
  permalink: string;
  caption: string;
  postedAt: string; // ISO Date String

  // Core Standardized Metrics
  impressions: number; // or Views
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;

  // Calculated standardized rate
  engagementRate: number;

  // Raw extended metrics for specific platforms
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

export type WarningSeverity = "info" | "warning" | "error";

export interface AnalyticsWarning {
  code: AnalyticsErrorType;
  message: string;
  severity: WarningSeverity;
  metadata?: Record<string, any>;
}

export interface DataQualityMetadata {
  status: "complete" | "partial" | "stale" | "cached_error";
  lastSuccessfulFetch?: string;
  cacheAge?: number;
  missingMetrics?: string[];
}

/**
 * Generic API Response wrapper
 */
export interface AnalyticsResponse<T> {
  data: T;
  warnings?: AnalyticsWarning[];
  dataQuality?: DataQualityMetadata;
}
