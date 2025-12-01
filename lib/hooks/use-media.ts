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

export function useMediaList(
  organizationId: string | null,
  filters: MediaFilters = {}
) {
  return useInfiniteQuery({
    queryKey: ["media", organizationId, filters],
    queryFn: ({ pageParam = 0 }) =>
      listMedia(organizationId!, { ...filters, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
    enabled: !!organizationId,
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });
}

export function useMediaItem(id: string | null, organizationId: string | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["media", id, organizationId],
    queryFn: () => getMedia(id!, organizationId!),
    enabled: !!id && !!organizationId,
    staleTime: 30000,
    initialData: () => {
      if (!id || !organizationId) return undefined;

      const queries = queryClient.getQueriesData<{
        pages: MediaListResponse[];
      }>({
        queryKey: ["media", organizationId],
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

export function useUploadMedia(organizationId: string | null) {
  const queryClient = useQueryClient();

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

      return uploadMedia(file, organizationId!, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media", organizationId] });
      toast.success("Media uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });
}

export function useUpdateMedia(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { filename?: string; altText?: string; folderId?: string | null };
    }) => updateMedia(id, organizationId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media updated");
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });
}

export function useDeleteMedia(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedia(id, organizationId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media deleted");
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });
}

export function useArchiveMedia(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveMedia(id, organizationId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media archived successfully");
    },
    onError: (error: Error) => {
      toast.error(`Archive failed: ${error.message}`);
    },
  });
}

export function useBulkDeleteMedia(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaIds: string[]) =>
      bulkDeleteMedia(organizationId!, mediaIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success(`Deleted ${data.deleted} items`);
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });
}

export function useBulkArchiveMedia(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaIds: string[]) =>
      bulkArchiveMedia(organizationId!, mediaIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success(`Archived ${data.archived} items`);
    },
    onError: (error: Error) => {
      toast.error(`Archive failed: ${error.message}`);
    },
  });
}

export function useBulkMoveMedia(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mediaIds,
      folderId,
    }: {
      mediaIds: string[];
      folderId: string | null;
    }) => bulkMoveMedia(organizationId!, mediaIds, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Media moved");
    },
    onError: (error: Error) => {
      toast.error(`Move failed: ${error.message}`);
    },
  });
}

export function useBulkTagMedia(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mediaIds,
      tagIds,
    }: {
      mediaIds: string[];
      tagIds: string[];
    }) => bulkTagMedia(organizationId!, mediaIds, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Tags added");
    },
    onError: (error: Error) => {
      toast.error(`Tagging failed: ${error.message}`);
    },
  });
}

export function useBulkUntagMedia(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mediaIds,
      tagIds,
    }: {
      mediaIds: string[];
      tagIds: string[];
    }) => bulkUntagMedia(organizationId!, mediaIds, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Tags removed");
    },
    onError: (error: Error) => {
      toast.error(`Untagging failed: ${error.message}`);
    },
  });
}

export function useFolderList(
  organizationId: string | null,
  parentId?: string | "root"
) {
  const validParentId =
    parentId === "root" || (parentId && parentId.length >= 32)
      ? parentId
      : undefined;

  return useQuery({
    queryKey: ["folders", organizationId, validParentId],
    queryFn: () => listFolders(organizationId!, validParentId),
    enabled: !!organizationId,
    staleTime: 60000,
  });
}

export function useFolder(id: string | null, organizationId: string | null) {
  return useQuery({
    queryKey: ["folder", id, organizationId],
    queryFn: () => getFolder(id!, organizationId!),
    enabled: !!id && !!organizationId,
    staleTime: 60000,
  });
}

export function useFolderBreadcrumb(
  id: string | null,
  organizationId: string | null
) {
  return useQuery({
    queryKey: ["folderBreadcrumb", id, organizationId],
    queryFn: () => getFolderBreadcrumb(id!, organizationId!),
    enabled: !!id && !!organizationId,
    staleTime: 60000,
  });
}

export function useCreateFolder(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId?: string }) =>
      createFolder(organizationId!, name, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder created");
    },
    onError: (error: Error) => {
      toast.error(`Create folder failed: ${error.message}`);
    },
  });
}

export function useRenameFolder(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      renameFolder(id, organizationId!, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder renamed");
    },
    onError: (error: Error) => {
      toast.error(`Rename failed: ${error.message}`);
    },
  });
}

export function useMoveFolder(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, parentId }: { id: string; parentId: string | null }) =>
      moveFolder(id, organizationId!, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder moved");
    },
    onError: (error: Error) => {
      toast.error(`Move failed: ${error.message}`);
    },
  });
}

export function useDeleteFolder(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFolder(id, organizationId!),
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

export function useTagList(organizationId: string | null, search?: string) {
  return useQuery({
    queryKey: ["tags", organizationId, search],
    queryFn: () => listTags(organizationId!, search),
    enabled: !!organizationId,
    staleTime: 60000,
  });
}

export function useCreateTag(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) =>
      createTag(organizationId!, name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag created");
    },
    onError: (error: Error) => {
      toast.error(`Create tag failed: ${error.message}`);
    },
  });
}

export function useUpdateTag(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; color?: string };
    }) => updateTag(id, organizationId!, data),
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

export function useDeleteTag(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id, organizationId!),
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

export function useAttachTags(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaId, tagIds }: { mediaId: string; tagIds: string[] }) =>
      attachTagsToMedia(mediaId, organizationId!, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (error: Error) => {
      toast.error(`Attach tags failed: ${error.message}`);
    },
  });
}

export function useDetachTags(organizationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaId, tagIds }: { mediaId: string; tagIds: string[] }) =>
      detachTagsFromMedia(mediaId, organizationId!, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (error: Error) => {
      toast.error(`Detach tags failed: ${error.message}`);
    },
  });
}
