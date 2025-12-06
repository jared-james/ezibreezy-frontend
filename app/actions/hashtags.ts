// app/actions/hashtags.ts
"use server";

import { serverFetch } from "@/lib/api/server-fetch";
import type {
  HashtagGroup,
  CreateHashtagGroupDto,
  UpdateHashtagGroupDto,
} from "@/lib/types/hashtags";

export async function listHashtagGroupsAction(
  workspaceId: string
): Promise<{ success: boolean; data?: HashtagGroup[]; error?: string }> {
  return await serverFetch<HashtagGroup[]>("/hashtags", { workspaceId });
}

export async function createHashtagGroupAction(
  dto: CreateHashtagGroupDto,
  workspaceId: string
): Promise<{ success: boolean; data?: HashtagGroup; error?: string }> {
  return await serverFetch<HashtagGroup>("/hashtags", {
    method: "POST",
    body: JSON.stringify(dto),
    workspaceId,
  });
}

export async function updateHashtagGroupAction(
  id: string,
  dto: UpdateHashtagGroupDto,
  workspaceId: string
): Promise<{ success: boolean; data?: HashtagGroup; error?: string }> {
  return await serverFetch<HashtagGroup>(`/hashtags/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
    workspaceId,
  });
}

export async function deleteHashtagGroupAction(
  id: string,
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch(`/hashtags/${id}`, {
    method: "DELETE",
    workspaceId,
  });
}
