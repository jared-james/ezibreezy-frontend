// lib/utils/media-validation.ts

import { MediaItem } from "@/lib/store/editorial-store";

export interface MediaConflict {
  platform: string;
  platformName: string;
  issue: "mixed_media" | "video_limit" | "image_limit" | "total_limit";
  message: string;
  imageCount: number;
  videoCount: number;
}

export const PLATFORM_RULES = {
  instagram: {
    name: "Instagram",
    allowMixedMedia: true, // Temporarily enabled for API testing
    maxVideos: 10,
    maxImages: 10,
    supportsCarousel: true,
  },
  facebook: {
    name: "Facebook",
    allowMixedMedia: true, // Temporarily enabled for API testing
    maxVideos: 10,
    maxImages: 10,
    supportsCarousel: true,
  },
  linkedin: {
    name: "LinkedIn",
    allowMixedMedia: false,
    maxVideos: 9,
    maxImages: 9,
    supportsCarousel: false,
  },
  x: {
    name: "X",
    allowMixedMedia: true,
    maxVideos: 4,
    maxImages: 4,
    supportsCarousel: false,
  },
  threads: {
    name: "Threads",
    allowMixedMedia: false,
    maxVideos: 20,
    maxImages: 20,
    supportsCarousel: false,
  },
  tiktok: {
    name: "TikTok",
    allowMixedMedia: false,
    maxVideos: 1,
    maxImages: 35,
    supportsCarousel: true,
  },
  youtube: {
    name: "YouTube",
    allowMixedMedia: false,
    maxVideos: 1,
    maxImages: 0,
    supportsCarousel: false,
  },
} as const;

export function shouldShowMediaOrdering(
  platformId: string,
  selectedItemCount: number
): boolean {
  const rules = PLATFORM_RULES[platformId as keyof typeof PLATFORM_RULES];

  if (!rules) return false;

  // Show ordering UI only if platform supports carousel AND multiple items selected
  return rules.supportsCarousel && selectedItemCount > 1;
}

function isVideo(mediaItem: MediaItem): boolean {
  return mediaItem.type === "video";
}

function isImage(mediaItem: MediaItem): boolean {
  return mediaItem.type === "image";
}

export function validateMediaSelectionForPlatform(
  platformId: string,
  mediaItems: MediaItem[]
): MediaConflict | null {
  const rules = PLATFORM_RULES[platformId as keyof typeof PLATFORM_RULES];

  if (!rules || mediaItems.length === 0) {
    return null;
  }

  const videos = mediaItems.filter(isVideo);
  const images = mediaItems.filter(isImage);
  const totalItems = mediaItems.length;
  const imageCount = images.length;
  const videoCount = videos.length;

  if (rules.allowMixedMedia) {
    const totalLimit = rules.maxImages;
    if (totalItems > totalLimit) {
      return {
        platform: platformId,
        platformName: rules.name,
        issue: "total_limit",
        message: `${rules.name} allows a maximum of ${totalLimit} total media items.`,
        imageCount,
        videoCount,
      };
    }
  } else {
    if (imageCount > 0 && videoCount > 0) {
      return {
        platform: platformId,
        platformName: rules.name,
        issue: "mixed_media",
        message: `${rules.name} doesn't support mixing photos and videos.`,
        imageCount,
        videoCount,
      };
    }
  }

  if (videoCount > rules.maxVideos) {
    return {
      platform: platformId,
      platformName: rules.name,
      issue: "video_limit",
      message: `${rules.name} allows a maximum of ${rules.maxVideos} video(s).`,
      imageCount,
      videoCount,
    };
  }

  if (imageCount > rules.maxImages) {
    return {
      platform: platformId,
      platformName: rules.name,
      issue: "image_limit",
      message: `${rules.name} allows a maximum of ${rules.maxImages} image(s).`,
      imageCount,
      videoCount,
    };
  }

  return null;
}

export function getPlatformMediaValidationErrors(
  selectedAccounts: Record<string, string[]>,
  platformMediaSelections: Record<string, string[]>,
  stagedMediaItems: MediaItem[]
): MediaConflict[] {
  const conflicts: MediaConflict[] = [];

  for (const platformId of Object.keys(selectedAccounts)) {
    const selectedUids = platformMediaSelections[platformId] || [];
    const selectedItems = selectedUids
      .map((uid) => stagedMediaItems.find((item) => item.uid === uid))
      .filter(Boolean) as MediaItem[];

    const conflict = validateMediaSelectionForPlatform(
      platformId,
      selectedItems
    );
    if (conflict) {
      conflicts.push(conflict);
    }
  }

  return conflicts;
}
