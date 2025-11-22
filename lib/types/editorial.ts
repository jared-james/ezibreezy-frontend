// lib/types/editorial.ts

/**
 * Unified type definitions for Editorial and Ideas features
 */

export type PostType = "text" | "image" | "video";

export type PlatformId =
  | "x"
  | "linkedin"
  | "youtube"
  | "instagram"
  | "facebook";

export type SelectedAccounts = Record<string, string[]>;

export interface Account {
  id: string;
  name: string;
  img: string;
}

export interface Platform {
  id: PlatformId | string; // Allow string for flexibility, but encourage PlatformId
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
 * Thread message structure (for DTO payload)
 */
export interface ThreadMessage {
  content: string;
  mediaIds?: string[];
}

/**
 * Thread message structure (Augmented for local UI/Preview)
 */
export interface ThreadMessageAugmented extends ThreadMessage {
  mediaPreviews?: string[];
  mediaFiles?: File[];
  isUploading?: boolean;
}

/**
 * Distribution metadata
 */
export interface DistributionMetadata {
  labels?: string;
  threadMessages?: ThreadMessage[];
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

  // Media (only for main post in this flow)
  media?: MediaFile;

  // Distribution
  distribution?: DistributionMetadata;

  // Schedule (editorial-specific)
  schedule?: ScheduleSettings;

  // Source metadata
  sourceClippingId?: string; // ID of the original clipping/idea/draft
  sourceDraftId?: string | null;
  sourceTitle?: string; // Title of the original clipping

  // NEW FIELDS
  recycleInterval?: number | null;
  aiGenerated?: boolean;
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
