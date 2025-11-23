// lib/types/editorial.ts

export type PostType = "text" | "image" | "video";

export type PlatformId =
  | "x"
  | "linkedin"
  | "youtube"
  | "instagram"
  | "facebook"
  | "threads";

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

export interface MediaFile {
  file: File | null;
  preview: string | null;
  type: "image" | "video";
}

export interface ThreadMessage {
  content: string;
  mediaIds?: string[];
}

export interface ThreadMessageAugmented extends ThreadMessage {
  mediaPreviews?: string[];
  mediaFiles?: File[];
  isUploading?: boolean;
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
  media?: MediaFile;
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
