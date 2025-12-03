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
  listMedia,
  getMedia,
  updateMedia,
  deleteMedia,
  archiveMedia,
  bulkDeleteMedia,
  bulkArchiveMedia,
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
  type MediaListResponse,
  type MediaItemWithUsage,
} from "@/lib/api/media";
import { toast } from "sonner";
import { generateVideoThumbnail } from "@/lib/utils/video-thumbnail";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export function useMediaList(filters: MediaFilters = {}) {
  const { currentWorkspace } = useWorkspaceStore();

  return useInfiniteQuery({
    queryKey: ["media", currentWorkspace?.id, filters],
    queryFn: ({ pageParam = 0 }) =>
      listMedia({ ...filters, offset: pageParam as number }),
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
    queryFn: () => getMedia(id!),
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

      return uploadMedia(file, thumbnail);
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

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { filename?: string; altText?: string; folderId?: string | null };
    }) => updateMedia(id, data),
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

  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
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

  return useMutation({
    mutationFn: (id: string) => archiveMedia(id),
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

  return useMutation({
    mutationFn: (mediaIds: string[]) => bulkDeleteMedia(mediaIds),
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

  return useMutation({
    mutationFn: (mediaIds: string[]) => bulkArchiveMedia(mediaIds),
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

  return useMutation({
    mutationFn: ({
      mediaIds,
      folderId,
    }: {
      mediaIds: string[];
      folderId: string | null;
    }) => bulkMoveMedia(mediaIds, folderId),
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

  return useMutation({
    mutationFn: ({
      mediaIds,
      tagIds,
    }: {
      mediaIds: string[];
      tagIds: string[];
    }) => bulkTagMedia(mediaIds, tagIds),
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

  return useMutation({
    mutationFn: ({
      mediaIds,
      tagIds,
    }: {
      mediaIds: string[];
      tagIds: string[];
    }) => bulkUntagMedia(mediaIds, tagIds),
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
    queryFn: () => listFolders(validParentId),
    enabled: !!currentWorkspace,
    staleTime: 60000,
  });
}

export function useFolder(id: string | null) {
  const { currentWorkspace } = useWorkspaceStore();

  return useQuery({
    queryKey: ["folder", id, currentWorkspace?.id],
    queryFn: () => getFolder(id!),
    enabled: !!id && !!currentWorkspace,
    staleTime: 60000,
  });
}

export function useFolderBreadcrumb(id: string | null) {
  const { currentWorkspace } = useWorkspaceStore();

  return useQuery({
    queryKey: ["folderBreadcrumb", id, currentWorkspace?.id],
    queryFn: () => getFolderBreadcrumb(id!),
    enabled: !!id && !!currentWorkspace,
    staleTime: 60000,
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId?: string }) =>
      createFolder(name, parentId),
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

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      renameFolder(id, name),
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

  return useMutation({
    mutationFn: ({ id, parentId }: { id: string; parentId: string | null }) =>
      moveFolder(id, parentId),
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

  return useMutation({
    mutationFn: (id: string) => deleteFolder(id),
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
    queryFn: () => listTags(search),
    enabled: !!currentWorkspace,
    staleTime: 60000,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) =>
      createTag(name, color),
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

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; color?: string };
    }) => updateTag(id, data),
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

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
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

  return useMutation({
    mutationFn: ({ mediaId, tagIds }: { mediaId: string; tagIds: string[] }) =>
      attachTagsToMedia(mediaId, tagIds),
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

  return useMutation({
    mutationFn: ({ mediaId, tagIds }: { mediaId: string; tagIds: string[] }) =>
      detachTagsFromMedia(mediaId, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (error: Error) => {
      toast.error(`Detach tags failed: ${error.message}`);
    },
  });
}
