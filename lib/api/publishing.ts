// lib/api/publishing.ts

import { PlatformCrops } from "../utils/crop-utils";
import apiClient from "./index";

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
  userId: string;
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
  status: "draft" | "scheduled" | "sent" | "failed" | "cancelled";
  platform: string;
  platformUsername: string;
  media: CalendarMediaItem[];
}

export interface FullPostDetails {
  id: string;
  title: string | null;
  content: string;
  integrationId: string;
  workspaceId: string;
  userId: string;
  scheduledAt: string | null;
  recycleInterval: number | null;
  settings: any;
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

interface PaginatedLibraryResponse {
  items: ScheduledPostResponse[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const createPost = async (
  payload: CreatePostPayload
): Promise<CreatePostResponse> => {
  const response = await apiClient.post<CreatePostResponse>(
    "/publishing/post",
    payload
  );
  return response.data;
};

export const reschedulePostOnly = async (
  postId: string,
  payload: RescheduleOnlyPayload
): Promise<CreatePostResponse> => {
  console.time("[API] reschedulePostOnly execution time");
  const response = await apiClient.patch<CreatePostResponse>(
    `/publishing/post/${postId}/schedule`,
    payload
  );
  console.timeEnd("[API] reschedulePostOnly execution time");
  return response.data;
};

export const getContentLibrary = async (): Promise<ScheduledPostResponse[]> => {
  const response = await apiClient.get<PaginatedLibraryResponse>(
    "/publishing/library"
  );
  return response.data?.items || [];
};

export const deletePost = async (postId: string): Promise<void> => {
  await apiClient.delete(`/publishing/post/${postId}`);
};

export const getPostDetails = async (
  postId: string
): Promise<FullPostDetails> => {
  const response = await apiClient.get<FullPostDetails>(
    `/publishing/post/${postId}`
  );
  return response.data;
};
