// lib/types/media.ts

export type MediaTypeFilter = "all" | "image" | "video";
export type MediaSortBy = "createdAt" | "filename" | "fileSize";
export type MediaSortOrder = "asc" | "desc";

export interface MediaTag {
  id: string;
  name: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFolderWithChildren extends MediaFolder {
  children: MediaFolder[];
  parent: MediaFolder | null;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

export interface MediaItem {
  id: string;
  workspaceId: string;
  folderId: string | null;
  url: string;
  thumbnailUrl: string | null;
  type: string;
  filename: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  tags: MediaTag[];
  usageCount: number;
}

export interface MediaItemWithUsage extends MediaItem {
  usedInPosts: {
    id: string;
    title: string | null;
    status: string;
    scheduledAt: string | null;
  }[];
}

export interface MediaFilters {
  folderId?: string;
  rootOnly?: boolean;
  tagIds?: string[];
  type?: MediaTypeFilter;
  search?: string;
  isUsed?: boolean;
  isUnused?: boolean;
  sortBy?: MediaSortBy;
  order?: MediaSortOrder;
  limit?: number;
  cursor?: string;
}

export interface MediaListResponse {
  data: MediaItem[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface UploadMediaResponse {
  mediaId: string;
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
}
