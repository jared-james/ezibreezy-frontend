// app/actions/publishing.ts
"use server";

import { serverFetch } from "@/lib/api/server-fetch";
import type {
  CreatePostPayload,
  CreatePostResponse,
  RescheduleOnlyPayload,
  ScheduledPostResponse,
  FullPostDetails,
  PaginatedLibraryResponse,
} from "@/lib/types/publishing";

export async function createPostAction(
  payload: CreatePostPayload,
  workspaceId: string
): Promise<{ success: boolean; data?: CreatePostResponse; error?: string }> {
  return await serverFetch<CreatePostResponse>("/publishing/post", {
    method: "POST",
    body: JSON.stringify(payload),
    workspaceId,
  });
}

export async function reschedulePostOnlyAction(
  postId: string,
  payload: RescheduleOnlyPayload,
  workspaceId: string
): Promise<{ success: boolean; data?: CreatePostResponse; error?: string }> {
  return await serverFetch<CreatePostResponse>(
    `/publishing/post/${postId}/schedule`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      workspaceId,
    }
  );
}

export async function getContentLibraryAction(
  workspaceId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{
  success: boolean;
  data?: ScheduledPostResponse[];
  error?: string;
}> {
  const params = new URLSearchParams();

  if (options?.startDate) params.set("startDate", options.startDate);
  if (options?.endDate) params.set("endDate", options.endDate);
  if (options?.limit) params.set("limit", options.limit.toString());
  if (options?.offset) params.set("offset", options.offset.toString());

  const queryString = params.toString();
  const url = queryString
    ? `/publishing/library?${queryString}`
    : "/publishing/library";

  const result = await serverFetch<PaginatedLibraryResponse>(url, {
    workspaceId,
  });

  if (result.success) {
    return { success: true, data: result.data?.items || [] };
  }

  return { success: false, error: result.error };
}

export async function deletePostAction(
  postId: string,
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch(`/publishing/post/${postId}`, {
    method: "DELETE",
    workspaceId,
  });
}

export async function getPostDetailsAction(
  postId: string,
  workspaceId: string
): Promise<{ success: boolean; data?: FullPostDetails; error?: string }> {
  return await serverFetch<FullPostDetails>(`/publishing/post/${postId}`, {
    workspaceId,
  });
}
