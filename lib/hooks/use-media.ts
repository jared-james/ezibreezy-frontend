// lib/hooks/use-media.ts

"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  type MediaFilters,
  type MediaListResponse,
  type MediaItemWithUsage,
} from "@/lib/types/media";
import {
  listMediaAction,
  getMediaAction,
  updateMediaAction,
  deleteMediaAction,
  archiveMediaAction,
  bulkDeleteMediaAction,
  bulkArchiveMediaAction,
  bulkMoveMediaAction,
  bulkTagMediaAction,
  bulkUntagMediaAction,
  listFoldersAction,
  getFolderAction,
  getFolderBreadcrumbAction,
  createFolderAction,
  renameFolderAction,
  moveFolderAction,
  deleteFolderAction,
  listTagsAction,
  createTagAction,
  updateTagAction,
  deleteTagAction,
  attachTagsToMediaAction,
  detachTagsFromMediaAction,
} from "@/app/actions/media";
import { toast } from "sonner";
import { generateVideoThumbnail } from "@/lib/utils/video-thumbnail";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { uploadMediaDirect } from "@/lib/api/media-upload";

export function useMediaList(filters: MediaFilters = {}) {
  const { currentWorkspace } = useWorkspaceStore();

  return useInfiniteQuery({
    queryKey: ["media", currentWorkspace?.id, filters],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await listMediaAction(currentWorkspace!.id, {
        ...filters,
        offset: pageParam as number,
      });
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
    enabled: !!currentWorkspace,
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });
}

export function useMediaItem(id: string | null) {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useQuery({
    queryKey: ["media", id, currentWorkspace?.id],
    queryFn: async () => {
      const result = await getMediaAction(id!, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!id && !!currentWorkspace,
    staleTime: 30000,
    initialData: () => {
      if (!id || !currentWorkspace) return undefined;

      const queries = queryClient.getQueriesData<{
        pages: MediaListResponse[];
      }>({
        queryKey: ["media", currentWorkspace.id],
      });

      for (const [_, queryData] of queries) {
        if (!queryData?.pages) continue;

        for (const page of queryData.pages) {
          const foundItem = page.data.find((item) => item.id === id);
          if (foundItem) {
            return {
              ...foundItem,
              folder: foundItem.folderId
                ? { id: foundItem.folderId, name: "Loading..." }
                : null,
              usedInPosts: [],
            } as MediaItemWithUsage;
          }
        }
      }

      return undefined;
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async (file: File) => {
      let thumbnail: File | undefined;

      if (file.type.startsWith("video/")) {
        try {
          thumbnail = await generateVideoThumbnail(file);
        } catch (e) {
          console.warn("Failed to generate client-side thumbnail", e);
        }
      }

      // Upload directly to backend API, bypassing Next.js server action
      return uploadMediaDirect(file, currentWorkspace!.id, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["media", currentWorkspace?.id],
      });
      toast.success("Media uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { filename?: string; altText?: string; folderId?: string | null };
    }) => {
      const result = await updateMediaAction(id, currentWorkspace!.id, data);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media updated");
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteMediaAction(id, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media deleted");
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });
}

export function useArchiveMedia() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await archiveMediaAction(id, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media archived successfully");
    },
    onError: (error: Error) => {
      toast.error(`Archive failed: ${error.message}`);
    },
  });
}

export function useBulkDeleteMedia() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async (mediaIds: string[]) => {
      const result = await bulkDeleteMediaAction(mediaIds, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success(`Deleted ${data.deleted} items`);
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });
}

export function useBulkArchiveMedia() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async (mediaIds: string[]) => {
      const result = await bulkArchiveMediaAction(mediaIds, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success(`Archived ${data.archived} items`);
    },
    onError: (error: Error) => {
      toast.error(`Archive failed: ${error.message}`);
    },
  });
}

export function useBulkMoveMedia() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({
      mediaIds,
      folderId,
    }: {
      mediaIds: string[];
      folderId: string | null;
    }) => {
      const result = await bulkMoveMediaAction(mediaIds, folderId, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media moved");
    },
    onError: (error: Error) => {
      toast.error(`Move failed: ${error.message}`);
    },
  });
}

export function useBulkTagMedia() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({
      mediaIds,
      tagIds,
    }: {
      mediaIds: string[];
      tagIds: string[];
    }) => {
      const result = await bulkTagMediaAction(mediaIds, tagIds, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Tags added");
    },
    onError: (error: Error) => {
      toast.error(`Tagging failed: ${error.message}`);
    },
  });
}

export function useBulkUntagMedia() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({
      mediaIds,
      tagIds,
    }: {
      mediaIds: string[];
      tagIds: string[];
    }) => {
      const result = await bulkUntagMediaAction(mediaIds, tagIds, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Tags removed");
    },
    onError: (error: Error) => {
      toast.error(`Untagging failed: ${error.message}`);
    },
  });
}

export function useFolderList(parentId?: string | "root") {
  const { currentWorkspace } = useWorkspaceStore();

  const validParentId =
    parentId === "root" || (parentId && parentId.length >= 32)
      ? parentId
      : undefined;

  return useQuery({
    queryKey: ["folders", currentWorkspace?.id, validParentId],
    queryFn: async () => {
      const result = await listFoldersAction(currentWorkspace!.id, validParentId);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!currentWorkspace,
    staleTime: 60000,
  });
}

export function useFolder(id: string | null) {
  const { currentWorkspace } = useWorkspaceStore();

  return useQuery({
    queryKey: ["folder", id, currentWorkspace?.id],
    queryFn: async () => {
      const result = await getFolderAction(id!, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!id && !!currentWorkspace,
    staleTime: 60000,
  });
}

export function useFolderBreadcrumb(id: string | null) {
  const { currentWorkspace } = useWorkspaceStore();

  return useQuery({
    queryKey: ["folderBreadcrumb", id, currentWorkspace?.id],
    queryFn: async () => {
      const result = await getFolderBreadcrumbAction(id!, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!id && !!currentWorkspace,
    staleTime: 60000,
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({ name, parentId }: { name: string; parentId?: string }) => {
      const result = await createFolderAction(name, currentWorkspace!.id, parentId);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder created");
    },
    onError: (error: Error) => {
      toast.error(`Create folder failed: ${error.message}`);
    },
  });
}

export function useRenameFolder() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const result = await renameFolderAction(id, name, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder renamed");
    },
    onError: (error: Error) => {
      toast.error(`Rename failed: ${error.message}`);
    },
  });
}

export function useMoveFolder() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({ id, parentId }: { id: string; parentId: string | null }) => {
      const result = await moveFolderAction(id, parentId, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder moved");
    },
    onError: (error: Error) => {
      toast.error(`Move failed: ${error.message}`);
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteFolderAction(id, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
    },
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

export function useTagList(search?: string) {
  const { currentWorkspace } = useWorkspaceStore();

  return useQuery({
    queryKey: ["tags", currentWorkspace?.id, search],
    queryFn: async () => {
      const result = await listTagsAction(currentWorkspace!.id, search);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!currentWorkspace,
    staleTime: 60000,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({ name, color }: { name: string; color?: string }) => {
      const result = await createTagAction(name, currentWorkspace!.id, color);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag created");
    },
    onError: (error: Error) => {
      toast.error(`Create tag failed: ${error.message}`);
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; color?: string };
    }) => {
      const result = await updateTagAction(id, data, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
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

export function useDeleteTag() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTagAction(id, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
    },
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

export function useAttachTags() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({ mediaId, tagIds }: { mediaId: string; tagIds: string[] }) => {
      const result = await attachTagsToMediaAction(mediaId, tagIds, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (error: Error) => {
      toast.error(`Attach tags failed: ${error.message}`);
    },
  });
}

export function useDetachTags() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async ({ mediaId, tagIds }: { mediaId: string; tagIds: string[] }) => {
      const result = await detachTagsFromMediaAction(mediaId, tagIds, currentWorkspace!.id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (error: Error) => {
      toast.error(`Detach tags failed: ${error.message}`);
    },
  });
}
