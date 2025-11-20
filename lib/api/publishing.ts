// lib/api/publishing.ts

import apiClient from "./index";

export interface ThreadMessagePayload {
  content: string;
  mediaIds?: string[];
}

export interface PostSettings {
  labels?: string;
  hashtags?: string;
  collaborators?: string;
  location?: string;
}

export interface CreatePostPayload {
  userId: string;
  integrationId: string;
  content: string;
  settings?: PostSettings;
  scheduledAt?: string;
  mediaIds?: string[];
  threadMessages?: ThreadMessagePayload[];
  recycleInterval?: number;
  aiGenerated?: boolean;
  sourceDraftId?: string;
}

// REMOVED: ReschedulePostPayload (full payload) - replaced by RescheduleOnlyPayload
// export interface ReschedulePostPayload { ... }

// NEW: Minimalist payload for the new backend endpoint
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
  organizationId: string;
  userId: string;
  scheduledAt: string | null;
  recycleInterval: number | null;
  settings: any;
  status: string;
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

/**
 * Creates a new post, either for immediate publishing or for scheduling.
 */
export const createPost = async (
  payload: CreatePostPayload
): Promise<CreatePostResponse> => {
  const response = await apiClient.post<CreatePostResponse>(
    "/publishing/post",
    payload
  );
  return response.data;
};

// REMOVED: Old slow reschedulePost function

/**
 * NEW: Minimalist function to update only the schedule of an existing post.
 * Uses PATCH /publishing/post/:postId/schedule
 */
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

/**
 * Fetches all content (drafts, scheduled, sent posts) for the user's organizations.
 */
export const getContentLibrary = async (): Promise<ScheduledPostResponse[]> => {
  const response = await apiClient.get<ScheduledPostResponse[]>(
    "/publishing/library"
  );
  return response.data;
};

/**
 * Cancels and deletes a scheduled post.
 */
export const deletePost = async (postId: string): Promise<void> => {
  await apiClient.delete(`/publishing/post/${postId}`);
};

/**
 * Fetches the full details of a single post for editing
 */
export const getPostDetails = async (
  postId: string
): Promise<FullPostDetails> => {
  const response = await apiClient.get<FullPostDetails>(
    `/publishing/post/${postId}`
  );
  return response.data;
};
