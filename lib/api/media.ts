// lib/api/media.ts

import apiClient from "./index";

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Media Assets
// ============================================================================

export const uploadMedia = async (
  file: File,
  organizationId: string,
  thumbnail?: File
): Promise<UploadMediaResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("organizationId", organizationId);

  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }

  const response = await apiClient.post<UploadMediaResponse>(
    "/media/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const listMedia = async (
  organizationId: string,
  filters: MediaFilters = {}
): Promise<MediaListResponse> => {
  const params = new URLSearchParams({ organizationId });

  if (filters.folderId) params.set("folderId", filters.folderId);
  if (filters.rootOnly) params.set("rootOnly", "true");
  if (filters.tagIds?.length) params.set("tagIds", filters.tagIds.join(","));
  if (filters.type) params.set("type", filters.type);
  if (filters.search) params.set("search", filters.search);
  if (filters.isUsed) params.set("isUsed", "true");
  if (filters.isUnused) params.set("isUnused", "true");
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.order) params.set("order", filters.order);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.offset) params.set("offset", String(filters.offset));

  const response = await apiClient.get<MediaListResponse>(`/media?${params}`);
  return response.data;
};

export const getMedia = async (
  id: string,
  organizationId: string
): Promise<MediaItemWithUsage> => {
  const response = await apiClient.get<MediaItemWithUsage>(
    `/media/${id}?organizationId=${organizationId}`
  );
  return response.data;
};

export const updateMedia = async (
  id: string,
  organizationId: string,
  data: {
    filename?: string;
    altText?: string;
    folderId?: string | null;
  }
): Promise<MediaItem> => {
  const response = await apiClient.patch<MediaItem>(
    `/media/${id}?organizationId=${organizationId}`,
    data
  );
  return response.data;
};

export const deleteMedia = async (
  id: string,
  organizationId: string
): Promise<void> => {
  await apiClient.delete(`/media/${id}?organizationId=${organizationId}`);
};

export const archiveMedia = async (
  id: string,
  organizationId: string
): Promise<MediaItem> => {
  const response = await apiClient.post<MediaItem>(
    `/media/${id}/archive?organizationId=${organizationId}`
  );
  return response.data;
};

// ============================================================================
// Bulk Operations
// ============================================================================

export const bulkDeleteMedia = async (
  organizationId: string,
  mediaIds: string[]
): Promise<{ success: boolean; deleted: number }> => {
  const response = await apiClient.post(
    `/media/bulk-delete?organizationId=${organizationId}`,
    { mediaIds }
  );
  return response.data;
};

export const bulkArchiveMedia = async (
  organizationId: string,
  mediaIds: string[]
): Promise<{ success: boolean; archived: number }> => {
  const response = await apiClient.post(
    `/media/bulk-archive?organizationId=${organizationId}`,
    { mediaIds }
  );
  return response.data;
};

export const bulkMoveMedia = async (
  organizationId: string,
  mediaIds: string[],
  folderId: string | null
): Promise<void> => {
  await apiClient.post(`/media/bulk-move?organizationId=${organizationId}`, {
    mediaIds,
    folderId,
  });
};

export const bulkTagMedia = async (
  organizationId: string,
  mediaIds: string[],
  tagIds: string[]
): Promise<void> => {
  await apiClient.post(`/media/bulk-tag?organizationId=${organizationId}`, {
    mediaIds,
    tagIds,
  });
};

export const bulkUntagMedia = async (
  organizationId: string,
  mediaIds: string[],
  tagIds: string[]
): Promise<void> => {
  await apiClient.post(`/media/bulk-untag?organizationId=${organizationId}`, {
    mediaIds,
    tagIds,
  });
};

// ============================================================================
// Folders
// ============================================================================

export const listFolders = async (
  organizationId: string,
  parentId?: string | "root"
): Promise<MediaFolder[]> => {
  const params = new URLSearchParams({ organizationId });
  if (parentId) params.set("parentId", parentId);

  const response = await apiClient.get<MediaFolder[]>(
    `/media/folders?${params}`
  );
  return response.data;
};

export const getFolder = async (
  id: string,
  organizationId: string
): Promise<MediaFolderWithChildren> => {
  const response = await apiClient.get<MediaFolderWithChildren>(
    `/media/folders/${id}?organizationId=${organizationId}`
  );
  return response.data;
};

export const getFolderBreadcrumb = async (
  id: string,
  organizationId: string
): Promise<BreadcrumbItem[]> => {
  const response = await apiClient.get<BreadcrumbItem[]>(
    `/media/folders/${id}/path?organizationId=${organizationId}`
  );
  return response.data;
};

export const createFolder = async (
  organizationId: string,
  name: string,
  parentId?: string
): Promise<MediaFolder> => {
  const body: { name: string; parentId?: string } = { name };
  if (parentId) {
    body.parentId = parentId;
  }
  const response = await apiClient.post<MediaFolder>(
    `/media/folders?organizationId=${organizationId}`,
    body
  );
  return response.data;
};

export const renameFolder = async (
  id: string,
  organizationId: string,
  name: string
): Promise<MediaFolder> => {
  const response = await apiClient.patch<MediaFolder>(
    `/media/folders/${id}?organizationId=${organizationId}`,
    { name }
  );
  return response.data;
};

export const moveFolder = async (
  id: string,
  organizationId: string,
  parentId: string | null
): Promise<void> => {
  await apiClient.patch(
    `/media/folders/${id}/move?organizationId=${organizationId}`,
    { parentId }
  );
};

export const deleteFolder = async (
  id: string,
  organizationId: string
): Promise<void> => {
  await apiClient.delete(
    `/media/folders/${id}?organizationId=${organizationId}`
  );
};

// ============================================================================
// Tags
// ============================================================================

export const listTags = async (
  organizationId: string,
  search?: string
): Promise<MediaTag[]> => {
  const params = new URLSearchParams({ organizationId });
  if (search) params.set("search", search);

  const response = await apiClient.get<MediaTag[]>(`/media/tags?${params}`);
  return response.data;
};

export const createTag = async (
  organizationId: string,
  name: string,
  color?: string
): Promise<MediaTag> => {
  const response = await apiClient.post<MediaTag>(
    `/media/tags?organizationId=${organizationId}`,
    { name, color }
  );
  return response.data;
};

export const updateTag = async (
  id: string,
  organizationId: string,
  data: { name?: string; color?: string }
): Promise<MediaTag> => {
  const response = await apiClient.patch<MediaTag>(
    `/media/tags/${id}?organizationId=${organizationId}`,
    data
  );
  return response.data;
};

export const deleteTag = async (
  id: string,
  organizationId: string
): Promise<void> => {
  await apiClient.delete(`/media/tags/${id}?organizationId=${organizationId}`);
};

export const attachTagsToMedia = async (
  mediaId: string,
  organizationId: string,
  tagIds: string[]
): Promise<void> => {
  await apiClient.post(
    `/media/${mediaId}/tags?organizationId=${organizationId}`,
    { tagIds }
  );
};

export const detachTagsFromMedia = async (
  mediaId: string,
  organizationId: string,
  tagIds: string[]
): Promise<void> => {
  await apiClient.delete(
    `/media/${mediaId}/tags?organizationId=${organizationId}`,
    { data: { tagIds } }
  );
};

// ============================================================================
// Download & View URLs
// ============================================================================

export const getMediaDownloadUrl = async (
  mediaId: string,
  organizationId: string
): Promise<{ downloadUrl: string; expiresIn: number }> => {
  const response = await apiClient.get<{
    downloadUrl: string;
    expiresIn: number;
  }>(`/media/${mediaId}/download-url?organizationId=${organizationId}`);
  return response.data;
};

export const getMediaViewUrl = async (
  mediaId: string,
  organizationId: string
): Promise<{ downloadUrl: string; expiresIn: number }> => {
  const response = await apiClient.get<{
    downloadUrl: string;
    expiresIn: number;
  }>(`/media/${mediaId}/view-url?organizationId=${organizationId}`);
  return response.data;
};
