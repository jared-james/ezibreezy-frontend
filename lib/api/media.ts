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
  isFavorite: boolean;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  tags: MediaTag[];
  usageCount: number;
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
  isFavorite?: boolean;
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
  integrationId: string
): Promise<UploadMediaResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("integrationId", integrationId);

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
  integrationId: string,
  filters: MediaFilters = {}
): Promise<MediaListResponse> => {
  const params = new URLSearchParams({ integrationId });

  if (filters.folderId) params.set("folderId", filters.folderId);
  if (filters.rootOnly) params.set("rootOnly", "true");
  if (filters.tagIds?.length) params.set("tagIds", filters.tagIds.join(","));
  if (filters.type) params.set("type", filters.type);
  if (filters.search) params.set("search", filters.search);
  if (filters.isFavorite) params.set("isFavorite", "true");
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
  integrationId: string
): Promise<MediaItemWithUsage> => {
  const response = await apiClient.get<MediaItemWithUsage>(
    `/media/${id}?integrationId=${integrationId}`
  );
  return response.data;
};

export const updateMedia = async (
  id: string,
  integrationId: string,
  data: {
    filename?: string;
    altText?: string;
    isFavorite?: boolean;
    folderId?: string | null;
  }
): Promise<MediaItem> => {
  const response = await apiClient.patch<MediaItem>(
    `/media/${id}?integrationId=${integrationId}`,
    data
  );
  return response.data;
};

export const deleteMedia = async (
  id: string,
  integrationId: string
): Promise<void> => {
  await apiClient.delete(`/media/${id}?integrationId=${integrationId}`);
};

// ============================================================================
// Bulk Operations
// ============================================================================

export const bulkDeleteMedia = async (
  integrationId: string,
  mediaIds: string[]
): Promise<{ success: boolean; deleted: number }> => {
  const response = await apiClient.post(
    `/media/bulk-delete?integrationId=${integrationId}`,
    { mediaIds }
  );
  return response.data;
};

export const bulkMoveMedia = async (
  integrationId: string,
  mediaIds: string[],
  folderId: string | null
): Promise<void> => {
  await apiClient.post(`/media/bulk-move?integrationId=${integrationId}`, {
    mediaIds,
    folderId,
  });
};

export const bulkTagMedia = async (
  integrationId: string,
  mediaIds: string[],
  tagIds: string[]
): Promise<void> => {
  await apiClient.post(`/media/bulk-tag?integrationId=${integrationId}`, {
    mediaIds,
    tagIds,
  });
};

export const bulkUntagMedia = async (
  integrationId: string,
  mediaIds: string[],
  tagIds: string[]
): Promise<void> => {
  await apiClient.post(`/media/bulk-untag?integrationId=${integrationId}`, {
    mediaIds,
    tagIds,
  });
};

// ============================================================================
// Folders
// ============================================================================

export const listFolders = async (
  integrationId: string,
  parentId?: string | "root"
): Promise<MediaFolder[]> => {
  const params = new URLSearchParams({ integrationId });
  if (parentId) params.set("parentId", parentId);

  const response = await apiClient.get<MediaFolder[]>(
    `/media/folders?${params}`
  );
  return response.data;
};

export const getFolder = async (
  id: string,
  integrationId: string
): Promise<MediaFolderWithChildren> => {
  const response = await apiClient.get<MediaFolderWithChildren>(
    `/media/folders/${id}?integrationId=${integrationId}`
  );
  return response.data;
};

export const getFolderBreadcrumb = async (
  id: string,
  integrationId: string
): Promise<BreadcrumbItem[]> => {
  const response = await apiClient.get<BreadcrumbItem[]>(
    `/media/folders/${id}/path?integrationId=${integrationId}`
  );
  return response.data;
};

export const createFolder = async (
  integrationId: string,
  name: string,
  parentId?: string
): Promise<MediaFolder> => {
  const body: { name: string; parentId?: string } = { name };
  if (parentId) {
    body.parentId = parentId;
  }
  const response = await apiClient.post<MediaFolder>(
    `/media/folders?integrationId=${integrationId}`,
    body
  );
  return response.data;
};

export const renameFolder = async (
  id: string,
  integrationId: string,
  name: string
): Promise<MediaFolder> => {
  const response = await apiClient.patch<MediaFolder>(
    `/media/folders/${id}?integrationId=${integrationId}`,
    { name }
  );
  return response.data;
};

export const moveFolder = async (
  id: string,
  integrationId: string,
  parentId: string | null
): Promise<void> => {
  await apiClient.patch(
    `/media/folders/${id}/move?integrationId=${integrationId}`,
    { parentId }
  );
};

export const deleteFolder = async (
  id: string,
  integrationId: string
): Promise<void> => {
  await apiClient.delete(
    `/media/folders/${id}?integrationId=${integrationId}`
  );
};

// ============================================================================
// Tags
// ============================================================================

export const listTags = async (
  integrationId: string,
  search?: string
): Promise<MediaTag[]> => {
  const params = new URLSearchParams({ integrationId });
  if (search) params.set("search", search);

  const response = await apiClient.get<MediaTag[]>(`/media/tags?${params}`);
  return response.data;
};

export const createTag = async (
  integrationId: string,
  name: string,
  color?: string
): Promise<MediaTag> => {
  const response = await apiClient.post<MediaTag>(
    `/media/tags?integrationId=${integrationId}`,
    { name, color }
  );
  return response.data;
};

export const updateTag = async (
  id: string,
  integrationId: string,
  data: { name?: string; color?: string }
): Promise<MediaTag> => {
  const response = await apiClient.patch<MediaTag>(
    `/media/tags/${id}?integrationId=${integrationId}`,
    data
  );
  return response.data;
};

export const deleteTag = async (
  id: string,
  integrationId: string
): Promise<void> => {
  await apiClient.delete(`/media/tags/${id}?integrationId=${integrationId}`);
};

export const attachTagsToMedia = async (
  mediaId: string,
  integrationId: string,
  tagIds: string[]
): Promise<void> => {
  await apiClient.post(
    `/media/${mediaId}/tags?integrationId=${integrationId}`,
    { tagIds }
  );
};

export const detachTagsFromMedia = async (
  mediaId: string,
  integrationId: string,
  tagIds: string[]
): Promise<void> => {
  await apiClient.delete(
    `/media/${mediaId}/tags?integrationId=${integrationId}`,
    { data: { tagIds } }
  );
};
