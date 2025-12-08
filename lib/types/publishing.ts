// lib/types/publishing.ts

import { PlatformCrops } from "../utils/crop-utils";

export interface ThreadMessagePayload {
  content: string;
  mediaIds?: string[];
}

export interface UserTagDto {
  username: string;
  x: number;
  y: number;
}

export interface ProductTagDto {
  productId: string;
  x: number;
  y: number;
}

export interface PostSettings {
  labels?: string;
  hashtags?: string;
  collaborators?: string | string[];

  location?: string;
  locationId?: string;
  firstComment?: string;
  canonicalContent?: string;
  postType?: "post" | "reel" | "story";
  userTags?: Record<string, UserTagDto[]>;
  productTags?: Record<string, ProductTagDto[]>;
  facebookPostType?: "post" | "reel" | "story";
  facebookFirstComment?: string;

  coverUrl?: string;
  thumbOffset?: number;
  shareToFeed?: boolean;

  video_cover_timestamp_ms?: number;

  topicTag?: string;
  linkAttachment?: string;

  privacyStatus?: "public" | "private" | "unlisted";
  categoryId?: string;
  tags?: string[];
  madeForKids?: boolean;
  thumbnailUrl?: string;

  // Pinterest Specific
  boardId?: string;
  link?: string;
  altText?: string;
}

export interface CreatePostPayload {
  userId?: string; // Optional - backend extracts from session token
  integrationId: string;
  content: string;
  title?: string;
  settings?: PostSettings;
  scheduledAt?: string;
  mediaIds?: string[];
  threadMessages?: ThreadMessagePayload[];
  recycleInterval?: number;
  aiGenerated?: boolean;
  sourceDraftId?: string;
  postType?: "post" | "reel" | "story";
  userTags?: Record<string, UserTagDto[]>;
  productTags?: Record<string, ProductTagDto[]>;
  mediaCrops?: Record<string, PlatformCrops>;
}

export interface RescheduleOnlyPayload {
  scheduledAt: string;
}

export interface CreatePostResponse {
  id: string;
  status: "sent" | "scheduled";
  platformPostId?: string;
}

export interface CalendarMediaItem {
  id: string;
  url: string;
  type: string;
  thumbnailUrl?: string | null;
}

export interface ScheduledPostResponse {
  id: string;
  title?: string | null;
  content: string;
  scheduledAt: string;
  status:
    | "draft"
    | "scheduled"
    | "sent"
    | "failed"
    | "cancelled"
    | "pending_approval"
    | "rejected";
  platform: string;
  platformUsername: string;
  media: CalendarMediaItem[];

  // === NEW FIELDS FROM BACKEND ===
  integrationId: string;
  postType: string;
  mediaCrops: Record<string, any>;
  threadSize: number;
  labels?: string[];
  requestedApproverIds?: string[];
  approvedByIds?: string[];
}

export interface FullPostDetails {
  id: string;
  title: string | null;
  content: string;
  integrationId: string;
  organizationId: string;
  userId: string;
  scheduledAt: string | null;
  recycleInterval: number | null;
  settings: PostSettings | null;
  status: string;
  error?: string | null;
  mediaIds: string[];
  threadMessages: {
    id: string;
    content: string;
    mediaIds: string[];
  }[];
  integration: {
    platform: string;
    platformUsername: string;
    avatarUrl: string | null;
    name: string | null;
  };
  allMedia: {
    [mediaId: string]: { id: string; url: string; type: string };
  };
}

export interface PaginatedLibraryResponse {
  items: ScheduledPostResponse[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
