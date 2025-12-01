// lib/types/editorial.ts

// The MediaItem type from the store is complex and includes File objects.
// For the draft, we only need to preserve the essential data that can be passed between pages.
export interface DraftMediaItem {
  uid: string;
  preview: string;
  type: "image" | "video";
  file?: File; // File is optional as it might not be serializable, but useful for in-memory transfer
}

export type PostType = "text" | "image" | "video";

export type PlatformPostType = "post" | "story" | "reel";

export type PlatformId =
  | "x"
  | "linkedin"
  | "youtube"
  | "instagram"
  | "facebook"
  | "threads"
  | "tiktok"
  | "pinterest";

export type SelectedAccounts = Record<string, string[]>;

export interface Account {
  id: string;
  name: string;
  img: string;
}

export interface Platform {
  id: PlatformId | string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  accounts: Account[];
}

export interface ThreadMessage {
  content: string;
  mediaIds?: string[];
}

export interface ThreadMessageAugmented extends ThreadMessage {
  mediaPreviews?: string[];
  mediaFiles?: File[];
  isUploading?: boolean;
  mediaType?: "text" | "image" | "video";
}

export interface DistributionMetadata {
  labels?: string;
  threadMessages?: ThreadMessage[];
  collaborators?: string;
  location?: string;
  firstComment?: string;
  userTags?: import("@/lib/api/publishing").UserTagDto[];
}

export interface ScheduleSettings {
  isScheduled: boolean;
  date?: string;
  time?: string;
}

export interface EditorialDraft {
  postType: PostType;
  mainCaption: string;
  platformCaptions: Record<string, string>;
  activePlatforms: string[];
  selectedAccounts: SelectedAccounts;
  stagedMediaItems?: DraftMediaItem[];
  platformMediaSelections?: Record<string, string[]>;
  distribution?: DistributionMetadata;
  schedule?: ScheduleSettings;
  sourceClippingId?: string;
  sourceDraftId?: string | null;
  sourceTitle?: string;
  recycleInterval?: number | null;
  aiGenerated?: boolean;
}

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
