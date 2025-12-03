// lib/types/hashtags.ts

export interface HashtagGroup {
  id: string;
  workspaceId: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHashtagGroupDto {
  name: string;
  content: string;
}

export interface UpdateHashtagGroupDto {
  name: string;
  content: string;
}
