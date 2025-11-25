// lib/types/hashtags.ts

export interface HashtagGroup {
  id: string;
  organizationId: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHashtagGroupDto {
  organizationId: string;
  name: string;
  content: string;
}

export interface UpdateHashtagGroupDto {
  organizationId: string;
  name: string;
  content: string;
}
