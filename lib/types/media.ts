// lib/types/media.ts

export interface MediaTag {
  id: string;
  name: string;
  color: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFolderWithChildren extends MediaFolder {
  parent: MediaFolder | null;
  children: MediaFolder[];
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  type: string;
  filename: string;
  fileSize: number;
  width: number;
  height: number;
  altText: string | null;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  tags: MediaTag[];
  usageCount: number;
  isArchived: boolean;
}

export interface MediaItemWithUsage extends MediaItem {
  folder: { id: string; name: string } | null;
  usedInPosts: {
    id: string;
    title: string;
    status: string;
    scheduledAt: string;
    createdAt: string;
  }[];
}

export interface MediaListResponse {
  data: MediaItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface MediaFilters {
  folderId?: string;
  rootOnly?: boolean;
  tagIds?: string[];
  type?: "image" | "video" | "gif";
  search?: string;
  isUsed?: boolean;
  isUnused?: boolean;
  sortBy?: "createdAt" | "filename" | "fileSize";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface UploadMediaResponse {
  mediaId: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}
