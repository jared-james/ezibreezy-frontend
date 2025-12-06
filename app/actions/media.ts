// app/actions/media.ts
"use server";

import { serverFetch } from "@/lib/api/server-fetch";
import type {
  MediaItem,
  MediaItemWithUsage,
  MediaListResponse,
  MediaFilters,
  UploadMediaResponse,
  MediaFolder,
  MediaFolderWithChildren,
  MediaTag,
  BreadcrumbItem,
} from "@/lib/types/media";

// ============================================================================
// Media Assets
// ============================================================================

export async function uploadMediaAction(
  formData: FormData,
  workspaceId: string
): Promise<{ success: boolean; data?: UploadMediaResponse; error?: string }> {
  const supabase = await (await import("@/lib/supabase/server")).createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const BACKEND_URL = process.env.BACKEND_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const response = await fetch(`${BACKEND_URL}/media/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "x-api-key": apiKey || "",
        "x-workspace-id": workspaceId,
      },
      body: formData, // Don't set Content-Type, let browser handle multipart boundary
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `Upload failed: ${response.statusText}`,
      }));
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function listMediaAction(
  workspaceId: string,
  filters: MediaFilters = {}
): Promise<{ success: boolean; data?: MediaListResponse; error?: string }> {
  const params = new URLSearchParams();

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

  const queryString = params.toString();
  const url = queryString ? `/media?${queryString}` : "/media";

  return await serverFetch<MediaListResponse>(url, { workspaceId });
}

export async function getMediaAction(
  id: string,
  workspaceId: string
): Promise<{ success: boolean; data?: MediaItemWithUsage; error?: string }> {
  return await serverFetch<MediaItemWithUsage>(`/media/${id}`, { workspaceId });
}

export async function updateMediaAction(
  id: string,
  workspaceId: string,
  data: {
    filename?: string;
    altText?: string;
    folderId?: string | null;
  }
): Promise<{ success: boolean; data?: MediaItem; error?: string }> {
  return await serverFetch<MediaItem>(`/media/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    workspaceId,
  });
}

export async function deleteMediaAction(
  id: string,
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch(`/media/${id}`, {
    method: "DELETE",
    workspaceId,
  });
}

export async function archiveMediaAction(
  id: string,
  workspaceId: string
): Promise<{ success: boolean; data?: MediaItem; error?: string }> {
  return await serverFetch<MediaItem>(`/media/${id}/archive`, {
    method: "POST",
    workspaceId,
  });
}

// ============================================================================
// Bulk Operations
// ============================================================================

export async function bulkDeleteMediaAction(
  mediaIds: string[],
  workspaceId: string
): Promise<{
  success: boolean;
  data?: { success: boolean; deleted: number };
  error?: string;
}> {
  return await serverFetch<{ success: boolean; deleted: number }>(
    "/media/bulk-delete",
    {
      method: "POST",
      body: JSON.stringify({ mediaIds }),
      workspaceId,
    }
  );
}

export async function bulkArchiveMediaAction(
  mediaIds: string[],
  workspaceId: string
): Promise<{
  success: boolean;
  data?: { success: boolean; archived: number };
  error?: string;
}> {
  return await serverFetch<{ success: boolean; archived: number }>(
    "/media/bulk-archive",
    {
      method: "POST",
      body: JSON.stringify({ mediaIds }),
      workspaceId,
    }
  );
}

export async function bulkMoveMediaAction(
  mediaIds: string[],
  folderId: string | null,
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch("/media/bulk-move", {
    method: "POST",
    body: JSON.stringify({ mediaIds, folderId }),
    workspaceId,
  });
}

export async function bulkTagMediaAction(
  mediaIds: string[],
  tagIds: string[],
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch("/media/bulk-tag", {
    method: "POST",
    body: JSON.stringify({ mediaIds, tagIds }),
    workspaceId,
  });
}

export async function bulkUntagMediaAction(
  mediaIds: string[],
  tagIds: string[],
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch("/media/bulk-untag", {
    method: "POST",
    body: JSON.stringify({ mediaIds, tagIds }),
    workspaceId,
  });
}

// ============================================================================
// Folders
// ============================================================================

export async function listFoldersAction(
  workspaceId: string,
  parentId?: string | "root"
): Promise<{ success: boolean; data?: MediaFolder[]; error?: string }> {
  const params = new URLSearchParams();
  if (parentId) params.set("parentId", parentId);

  const queryString = params.toString();
  const url = queryString ? `/media/folders?${queryString}` : "/media/folders";

  return await serverFetch<MediaFolder[]>(url, { workspaceId });
}

export async function getFolderAction(
  id: string,
  workspaceId: string
): Promise<{
  success: boolean;
  data?: MediaFolderWithChildren;
  error?: string;
}> {
  return await serverFetch<MediaFolderWithChildren>(
    `/media/folders/${id}`,
    { workspaceId }
  );
}

export async function getFolderBreadcrumbAction(
  id: string,
  workspaceId: string
): Promise<{ success: boolean; data?: BreadcrumbItem[]; error?: string }> {
  return await serverFetch<BreadcrumbItem[]>(`/media/folders/${id}/path`, {
    workspaceId,
  });
}

export async function createFolderAction(
  name: string,
  workspaceId: string,
  parentId?: string
): Promise<{ success: boolean; data?: MediaFolder; error?: string }> {
  const body: { name: string; parentId?: string } = { name };
  if (parentId) {
    body.parentId = parentId;
  }

  return await serverFetch<MediaFolder>("/media/folders", {
    method: "POST",
    body: JSON.stringify(body),
    workspaceId,
  });
}

export async function renameFolderAction(
  id: string,
  name: string,
  workspaceId: string
): Promise<{ success: boolean; data?: MediaFolder; error?: string }> {
  return await serverFetch<MediaFolder>(`/media/folders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
    workspaceId,
  });
}

export async function moveFolderAction(
  id: string,
  parentId: string | null,
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch(`/media/folders/${id}/move`, {
    method: "PATCH",
    body: JSON.stringify({ parentId }),
    workspaceId,
  });
}

export async function deleteFolderAction(
  id: string,
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch(`/media/folders/${id}`, {
    method: "DELETE",
    workspaceId,
  });
}

// ============================================================================
// Tags
// ============================================================================

export async function listTagsAction(
  workspaceId: string,
  search?: string
): Promise<{ success: boolean; data?: MediaTag[]; error?: string }> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);

  const queryString = params.toString();
  const url = queryString ? `/media/tags?${queryString}` : "/media/tags";

  return await serverFetch<MediaTag[]>(url, { workspaceId });
}

export async function createTagAction(
  name: string,
  workspaceId: string,
  color?: string
): Promise<{ success: boolean; data?: MediaTag; error?: string }> {
  return await serverFetch<MediaTag>("/media/tags", {
    method: "POST",
    body: JSON.stringify({ name, color }),
    workspaceId,
  });
}

export async function updateTagAction(
  id: string,
  data: { name?: string; color?: string },
  workspaceId: string
): Promise<{ success: boolean; data?: MediaTag; error?: string }> {
  return await serverFetch<MediaTag>(`/media/tags/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    workspaceId,
  });
}

export async function deleteTagAction(
  id: string,
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch(`/media/tags/${id}`, {
    method: "DELETE",
    workspaceId,
  });
}

export async function attachTagsToMediaAction(
  mediaId: string,
  tagIds: string[],
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch(`/media/${mediaId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tagIds }),
    workspaceId,
  });
}

export async function detachTagsFromMediaAction(
  mediaId: string,
  tagIds: string[],
  workspaceId: string
): Promise<{ success: boolean; error?: string }> {
  return await serverFetch(`/media/${mediaId}/tags`, {
    method: "DELETE",
    body: JSON.stringify({ tagIds }),
    workspaceId,
  });
}

// ============================================================================
// Download & View URLs
// ============================================================================

export async function getMediaDownloadUrlAction(
  mediaId: string,
  workspaceId: string
): Promise<{
  success: boolean;
  data?: { downloadUrl: string; expiresIn: number };
  error?: string;
}> {
  return await serverFetch<{ downloadUrl: string; expiresIn: number }>(
    `/media/${mediaId}/download-url`,
    { workspaceId }
  );
}

export async function getMediaViewUrlAction(
  mediaId: string,
  workspaceId: string
): Promise<{
  success: boolean;
  data?: { downloadUrl: string; expiresIn: number };
  error?: string;
}> {
  return await serverFetch<{ downloadUrl: string; expiresIn: number }>(
    `/media/${mediaId}/view-url`,
    { workspaceId }
  );
}
