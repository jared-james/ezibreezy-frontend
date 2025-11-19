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
  content: string;
  scheduledAt: string;
  status: "draft" | "scheduled" | "sent" | "failed" | "cancelled";
  platform: string;
  platformUsername: string;
  media: CalendarMediaItem[];
}

// NEW: Interface for the full post details from GET /publishing/post/:postId
export interface FullPostDetails {
  id: string;
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
    id: string; // child post id (only used internally)
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
    [mediaId: string]: { id: string; url: string; type: string }; // Map of all media records
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

/**
 * Fetches all scheduled posts for the user's organizations.
 */
export const getScheduledPosts = async (): Promise<ScheduledPostResponse[]> => {
  const response = await apiClient.get<ScheduledPostResponse[]>(
    "/publishing/scheduled"
  );
  return response.data;
};

/**
 * Cancels and deletes a scheduled post.
 */
export const deletePost = async (postId: string): Promise<void> => {
  await apiClient.delete(`/publishing/post/${postId}`);
};

// NEW: Fetches the full details of a single post for editing
export const getPostDetails = async (
  postId: string
): Promise<FullPostDetails> => {
  const response = await apiClient.get<FullPostDetails>(
    `/publishing/post/${postId}`
  );
  return response.data;
};
