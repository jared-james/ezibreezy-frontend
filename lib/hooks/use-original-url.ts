// lib/hooks/use-original-url.ts

"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { getMediaViewUrl } from "@/lib/api/media";
import type { MediaItem } from "@/lib/store/editorial/draft-store";

export function useOriginalUrl(organizationId: string | null) {
  const getOriginalUrl = useCallback(
    async (item: MediaItem): Promise<string | null> => {
      if (!item.id || !organizationId) return null;
      try {
        const { downloadUrl } = await getMediaViewUrl(item.id, organizationId);
        return downloadUrl;
      } catch (error) {
        console.error("Failed to fetch original URL", error);
        toast.error("Failed to load high-quality image");
        return null;
      }
    },
    [organizationId]
  );

  return { getOriginalUrl };
}
