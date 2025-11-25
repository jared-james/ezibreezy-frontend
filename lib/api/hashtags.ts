// lib/api/hashtags.ts

import apiClient from "./index";
import {
  HashtagGroup,
  CreateHashtagGroupDto,
  UpdateHashtagGroupDto,
} from "@/lib/types/hashtags";

// ============================================================================
// Hashtag Groups
// ============================================================================

export const listHashtagGroups = async (
  organizationId: string
): Promise<HashtagGroup[]> => {
  const response = await apiClient.get<HashtagGroup[]>(
    `/hashtags?organizationId=${organizationId}`
  );
  return response.data;
};

export const createHashtagGroup = async (
  dto: CreateHashtagGroupDto
): Promise<HashtagGroup> => {
  const response = await apiClient.post<HashtagGroup>("/hashtags", dto);
  return response.data;
};

export const updateHashtagGroup = async (
  id: string,
  dto: UpdateHashtagGroupDto
): Promise<HashtagGroup> => {
  const response = await apiClient.patch<HashtagGroup>(`/hashtags/${id}`, dto);
  return response.data;
};

export const deleteHashtagGroup = async (
  id: string,
  organizationId: string
): Promise<void> => {
  await apiClient.delete(
    `/hashtags/${id}?organizationId=${organizationId}`
  );
};
