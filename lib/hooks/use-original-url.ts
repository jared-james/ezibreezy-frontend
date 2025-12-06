// lib/hooks/use-original-url.ts

"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { getMediaViewUrlAction } from "@/app/actions/media";
import type { MediaItem } from "@/lib/store/editorial/draft-store";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export function useOriginalUrl() {
  const { currentWorkspace } = useWorkspaceStore();

  const getOriginalUrl = useCallback(
    async (item: MediaItem): Promise<string | null> => {
      if (!item.id || !currentWorkspace) return null;
      try {
        const result = await getMediaViewUrlAction(item.id, currentWorkspace.id);
        if (!result.success) throw new Error(result.error);
        return result.data!.downloadUrl;
      } catch (error) {
        console.error("Failed to fetch original URL", error);
        toast.error("Failed to load high-quality image");
        return null;
      }
    },
    [currentWorkspace]
  );

  return { getOriginalUrl };
}
