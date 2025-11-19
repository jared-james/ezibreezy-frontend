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
}

export interface CreatePostResponse {
  id: string;
  status: "sent" | "scheduled";
  platformPostId?: string;
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
