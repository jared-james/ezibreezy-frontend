// lib/hooks/use-media.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listMedia,
  getMedia,
  updateMedia,
  deleteMedia,
  bulkDeleteMedia,
  bulkMoveMedia,
  bulkTagMedia,
  bulkUntagMedia,
  listFolders,
  getFolder,
  getFolderBreadcrumb,
  createFolder,
  renameFolder,
  moveFolder,
  deleteFolder,
  listTags,
  createTag,
  updateTag,
  deleteTag,
  attachTagsToMedia,
  detachTagsFromMedia,
  uploadMedia,
  type MediaFilters,
} from "@/lib/api/media";
import { toast } from "sonner";

// ============================================================================
// Media Queries
// ============================================================================

export function useMediaList(integrationId: string | null, filters: MediaFilters = {}) {
  return useQuery({
    queryKey: ["media", integrationId, filters],
    queryFn: () => listMedia(integrationId!, filters),
    enabled: !!integrationId,
    staleTime: 30000,
  });
}

export function useMediaItem(id: string | null, integrationId: string | null) {
  return useQuery({
    queryKey: ["media", id, integrationId],
    queryFn: () => getMedia(id!, integrationId!),
    enabled: !!id && !!integrationId,
    staleTime: 30000,
  });
}

// ============================================================================
// Media Mutations
// ============================================================================

export function useUploadMedia(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadMedia(file, integrationId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media", integrationId] });
      toast.success("Media uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });
}

export function useUpdateMedia(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { filename?: string; altText?: string; isFavorite?: boolean; folderId?: string | null };
    }) => updateMedia(id, integrationId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media updated");
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });
}

export function useDeleteMedia(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedia(id, integrationId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media deleted");
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });
}

export function useBulkDeleteMedia(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaIds: string[]) => bulkDeleteMedia(integrationId!, mediaIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success(`Deleted ${data.deleted} items`);
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });
}

export function useBulkMoveMedia(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaIds, folderId }: { mediaIds: string[]; folderId: string | null }) =>
      bulkMoveMedia(integrationId!, mediaIds, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media moved");
    },
    onError: (error: Error) => {
      toast.error(`Move failed: ${error.message}`);
    },
  });
}

export function useBulkTagMedia(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaIds, tagIds }: { mediaIds: string[]; tagIds: string[] }) =>
      bulkTagMedia(integrationId!, mediaIds, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Tags added");
    },
    onError: (error: Error) => {
      toast.error(`Tagging failed: ${error.message}`);
    },
  });
}

export function useBulkUntagMedia(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaIds, tagIds }: { mediaIds: string[]; tagIds: string[] }) =>
      bulkUntagMedia(integrationId!, mediaIds, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Tags removed");
    },
    onError: (error: Error) => {
      toast.error(`Untagging failed: ${error.message}`);
    },
  });
}

// ============================================================================
// Folder Queries
// ============================================================================

export function useFolderList(integrationId: string | null, parentId?: string | "root") {
  // Ensure parentId is either "root", a valid-looking UUID, or undefined
  const validParentId = parentId === "root" || (parentId && parentId.length >= 32) ? parentId : undefined;

  return useQuery({
    queryKey: ["folders", integrationId, validParentId],
    queryFn: () => listFolders(integrationId!, validParentId),
    enabled: !!integrationId,
    staleTime: 60000,
  });
}

export function useFolder(id: string | null, integrationId: string | null) {
  return useQuery({
    queryKey: ["folder", id, integrationId],
    queryFn: () => getFolder(id!, integrationId!),
    enabled: !!id && !!integrationId,
    staleTime: 60000,
  });
}

export function useFolderBreadcrumb(id: string | null, integrationId: string | null) {
  return useQuery({
    queryKey: ["folderBreadcrumb", id, integrationId],
    queryFn: () => getFolderBreadcrumb(id!, integrationId!),
    enabled: !!id && !!integrationId,
    staleTime: 60000,
  });
}

// ============================================================================
// Folder Mutations
// ============================================================================

export function useCreateFolder(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId?: string }) =>
      createFolder(integrationId!, name, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder created");
    },
    onError: (error: Error) => {
      toast.error(`Create folder failed: ${error.message}`);
    },
  });
}

export function useRenameFolder(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      renameFolder(id, integrationId!, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder renamed");
    },
    onError: (error: Error) => {
      toast.error(`Rename failed: ${error.message}`);
    },
  });
}

export function useMoveFolder(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, parentId }: { id: string; parentId: string | null }) =>
      moveFolder(id, integrationId!, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder moved");
    },
    onError: (error: Error) => {
      toast.error(`Move failed: ${error.message}`);
    },
  });
}

export function useDeleteFolder(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFolder(id, integrationId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Folder deleted");
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });
}

// ============================================================================
// Tag Queries
// ============================================================================

export function useTagList(integrationId: string | null, search?: string) {
  return useQuery({
    queryKey: ["tags", integrationId, search],
    queryFn: () => listTags(integrationId!, search),
    enabled: !!integrationId,
    staleTime: 60000,
  });
}

// ============================================================================
// Tag Mutations
// ============================================================================

export function useCreateTag(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) =>
      createTag(integrationId!, name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag created");
    },
    onError: (error: Error) => {
      toast.error(`Create tag failed: ${error.message}`);
    },
  });
}

export function useUpdateTag(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; color?: string } }) =>
      updateTag(id, integrationId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Tag updated");
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });
}

export function useDeleteTag(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id, integrationId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Tag deleted");
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });
}

export function useAttachTags(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaId, tagIds }: { mediaId: string; tagIds: string[] }) =>
      attachTagsToMedia(mediaId, integrationId!, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (error: Error) => {
      toast.error(`Attach tags failed: ${error.message}`);
    },
  });
}

export function useDetachTags(integrationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaId, tagIds }: { mediaId: string; tagIds: string[] }) =>
      detachTagsFromMedia(mediaId, integrationId!, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (error: Error) => {
      toast.error(`Detach tags failed: ${error.message}`);
    },
  });
}
