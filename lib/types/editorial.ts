// lib/types/editorial.ts

/**
 * Unified type definitions for Editorial and Ideas features
 */

export type PostType = "text" | "image" | "video";

export type SelectedAccounts = Record<string, string[]>;

export interface Account {
  id: string;
  name: string;
  img: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>; // Lucide icon component type
  accounts: Account[];
}

/**
 * Media file information
 */
export interface MediaFile {
  file: File | null;
  preview: string | null;
  type: "image" | "video";
}

/**
 * Distribution metadata
 */
export interface DistributionMetadata {
  labels?: string;
  hashtags?: string;
  firstComment?: string;
  collaborators?: string;
  location?: string;
}

/**
 * Schedule settings
 */
export interface ScheduleSettings {
  isScheduled: boolean;
  date?: string;
  time?: string;
}

/**
 * Complete editorial draft data
 * Used for transferring data from Ideas to Editorial
 */
export interface EditorialDraft {
  // Post content
  postType: PostType;
  mainCaption: string;
  platformCaptions: Record<string, string>;

  // Platform and account selections
  activePlatforms: string[]; // Array of platform IDs
  selectedAccounts: SelectedAccounts;

  // Media
  media?: MediaFile;

  // Distribution
  distribution?: DistributionMetadata;

  // Schedule (editorial-specific)
  schedule?: ScheduleSettings;

  // Source metadata
  sourceId?: string; // ID of the original clipping/idea
  sourceTitle?: string; // Title of the original clipping
}

/**
 * Clipping data structure (from database)
 */
export interface Clipping {
  id: string;
  title: string;
  body: string;
  tags: string[];
  hashtags?: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}
