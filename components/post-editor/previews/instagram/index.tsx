// components/post-editor/previews/instagram/index.tsx

"use client";

import { memo, useState, useRef, useEffect } from "react";
import { UserTagDto } from "@/lib/api/publishing";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import type { PixelCrop } from "react-image-crop";
import {
  createCroppedPreviewUrl,
  type CropData,
  STORY_ASPECT_RATIO,
  calculateCenteredCrop,
} from "@/lib/utils/crop-utils";
import { useEditorialStore, MediaItem } from "@/lib/store/editorial-store";
import { getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";
import LocationSearchInput from "../../location-search-input";

// Sub-components
import { InstagramHeader } from "./instagram-header";
import { InstagramGridView } from "./instagram-grid-view";
import { InstagramPostFooter } from "./instagram-post-footer";
import { InstagramMediaDisplay } from "./instagram-media-display";
import { InstagramToolbar } from "./instagram-toolbar";
import { InstagramReelOptions } from "./instagram-reel-options";
import { InstagramCarousel } from "./instagram-carousel";
import { InstagramStoryCarousel } from "./instagram-story-carousel";

interface InstagramPreviewProps {
  caption: string;
  singleMediaItem: MediaItem | null;
  mediaItems?: MediaItem[];
  mediaType?: "image" | "video" | "text";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  collaborators: string;
  postType: "post" | "reel" | "story";
  userTags: Record<string, UserTagDto[]>; // Changed: keyed by mediaId
  onUserTagsChange: (tags: Record<string, UserTagDto[]>) => void;
  aspectRatio?: number;
  coverUrl?: string | null;
  onCoverChange?: (url: string | null) => void;
  thumbOffset?: number | null;
  onThumbOffsetChange?: (offset: number | null) => void;
  shareToFeed?: boolean;
  onShareToFeedChange?: (val: boolean) => void;
}

function InstagramPreview({
  caption,
  singleMediaItem,
  mediaItems = [],
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
  collaborators,
  postType,
  userTags,
  onUserTagsChange,
  aspectRatio = 1,
  coverUrl,
  onCoverChange,
  thumbOffset,
  onThumbOffsetChange,
  shareToFeed,
  onShareToFeedChange,
}: InstagramPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);
  const setState = useEditorialStore((state) => state.setState);
  const location = useEditorialStore((state) => state.location);

  // Local State
  const [isTaggingMode, setIsTaggingMode] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"post" | "grid">("post");
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const integrationId = selectedAccounts["instagram"]?.[0];

  // Derived Values
  const displayMediaSrc =
    singleMediaItem?.croppedPreviews?.instagram || singleMediaItem?.preview;
  const canCrop = !!singleMediaItem?.id && mediaType === "image";
  const originalMediaSrc = singleMediaItem?.file
    ? singleMediaItem.preview
    : singleMediaItem?.originalUrlForCropping;

  const previewAspectRatio = postType === "story" ? 9 / 16 : aspectRatio;

  // Determine if we have multiple media items
  const hasMultipleMedia = mediaItems.length > 1;
  const isCarousel = hasMultipleMedia && postType === "post";
  const isStoryCarousel = hasMultipleMedia && postType === "story";

  // For carousels, tagging is supported if ANY image exists
  // For single media, tagging is supported if it's a post with an image
  const isTaggingSupported = isCarousel
    ? postType === "post" && mediaItems.some((item) => item.type === "image")
    : !!displayMediaSrc && postType === "post" && mediaType !== "video";

  // Effects
  useEffect(() => {
    if (postType === "story") {
      setViewMode("post");
    }
  }, [postType]);

  useEffect(() => {
    if (!isTaggingSupported) {
      setIsTaggingMode(false);
    }
  }, [isTaggingSupported]);

  // Auto-crop logic for Stories
  const prevPostTypeRef = useRef(postType);
  useEffect(() => {
    const applyAutoCrop = async () => {
      if (!originalMediaSrc) return;

      // Logic: If switching TO story from post
      if (prevPostTypeRef.current !== "story" && postType === "story") {
        try {
          const img = new window.Image();
          img.src = originalMediaSrc;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
          });

          const displayedWidth = img.naturalWidth;
          const displayedHeight = img.naturalHeight;
          const cropPixels = calculateCenteredCrop(
            displayedWidth,
            displayedHeight,
            STORY_ASPECT_RATIO
          );
          const croppedUrl = await createCroppedPreviewUrl(
            originalMediaSrc,
            cropPixels,
            displayedWidth,
            displayedHeight
          );

          onCropComplete(
            { croppedAreaPixels: cropPixels, aspectRatio: STORY_ASPECT_RATIO },
            croppedUrl
          );
        } catch (error) {
          console.error("Failed to auto-crop for story:", error);
        }
      }
      // Logic: If switching FROM story to post
      else if (
        prevPostTypeRef.current === "story" &&
        postType === "post" &&
        aspectRatio === STORY_ASPECT_RATIO
      ) {
        onCropComplete(undefined, "");
      }
      prevPostTypeRef.current = postType;
    };
    applyAutoCrop();
  }, [postType, aspectRatio, originalMediaSrc]);

  // Handlers
  const onCropComplete = (
    cropData: CropData | undefined,
    croppedPreviewUrl: string
  ) => {
    if (singleMediaItem) {
      setCropForMedia(
        singleMediaItem.uid,
        "instagram",
        cropData,
        croppedPreviewUrl
      );
    }
  };

  const handleCropComplete = async (
    croppedAreaPixels: PixelCrop,
    newAspectRatio: number,
    displayedWidth: number,
    displayedHeight: number
  ) => {
    if (!originalMediaSrc) return;
    try {
      const getOriginalDimensions = (
        src: string
      ): Promise<{ width: number; height: number }> =>
        new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = () =>
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = reject;
          img.src = src;
        });

      const dims = await getOriginalDimensions(originalMediaSrc);
      const scalingFactor = dims.width / displayedWidth;
      const scaledPixels: PixelCrop = {
        unit: "px",
        x: Math.round(croppedAreaPixels.x * scalingFactor),
        y: Math.round(croppedAreaPixels.y * scalingFactor),
        width: Math.round(croppedAreaPixels.width * scalingFactor),
        height: Math.round(croppedAreaPixels.height * scalingFactor),
      };

      const croppedUrl = await createCroppedPreviewUrl(
        originalMediaSrc,
        croppedAreaPixels,
        displayedWidth,
        displayedHeight
      );

      onCropComplete(
        { croppedAreaPixels: scaledPixels, aspectRatio: newAspectRatio },
        croppedUrl
      );
    } catch (error) {
      console.error("Failed to crop image:", error);
    }
  };

  const handleCropClick = async () => {
    if (!canCrop || !singleMediaItem || !singleMediaItem.id) return;

    if (singleMediaItem.originalUrlForCropping) {
      setIsCropperOpen(true);
      return;
    }

    setIsFetchingOriginal(true);
    try {
      if (!integrationId) throw new Error("Instagram account not selected.");
      const { downloadUrl } = await getMediaViewUrl(
        singleMediaItem.id,
        integrationId
      );

      // Update store so next time we don't fetch
      const currentItems = useEditorialStore.getState().stagedMediaItems;
      const updatedItems = currentItems.map((item) =>
        item.uid === singleMediaItem.uid
          ? { ...item, originalUrlForCropping: downloadUrl }
          : item
      );
      useEditorialStore.getState().setStagedMediaItems(updatedItems);

      setIsCropperOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Could not load original image for cropping.");
    } finally {
      setIsFetchingOriginal(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4 transition-all duration-300">
      <div className="bg-[--surface] border border-[--border] shadow-lg">
        {/* Header */}
        <InstagramHeader
          avatarUrl={avatarUrl}
          primaryName={primaryName}
          location={location.name}
        />

        {/* Content Area */}
        {viewMode === "grid" ? (
          <InstagramGridView
            displayMediaSrc={displayMediaSrc}
            mediaType={mediaType}
            coverUrl={coverUrl}
            thumbOffset={thumbOffset}
          />
        ) : isStoryCarousel ? (
          <InstagramStoryCarousel
            mediaItems={mediaItems}
            aspectRatio={previewAspectRatio}
            onVideoMetadataLoaded={setVideoDuration}
          />
        ) : isCarousel ? (
          <InstagramCarousel
            mediaItems={mediaItems}
            aspectRatio={previewAspectRatio}
            isTaggingMode={isTaggingMode}
            tags={userTags}
            onAddTag={(mediaId, tag) => {
              const newTags = { ...userTags };
              newTags[mediaId] = [...(newTags[mediaId] || []), tag];
              onUserTagsChange(newTags);
            }}
            onRemoveTag={(mediaId, idx) => {
              const newTags = { ...userTags };
              if (newTags[mediaId]) {
                newTags[mediaId] = newTags[mediaId].filter((_, i) => i !== idx);
                if (newTags[mediaId].length === 0) {
                  delete newTags[mediaId];
                }
              }
              onUserTagsChange(newTags);
            }}
            onVideoMetadataLoaded={setVideoDuration}
          />
        ) : (
          <InstagramMediaDisplay
            displayMediaSrc={displayMediaSrc}
            mediaType={mediaType}
            aspectRatio={previewAspectRatio}
            isTaggingMode={isTaggingMode}
            mediaId={singleMediaItem?.id || null}
            tags={singleMediaItem?.id ? userTags[singleMediaItem.id] || [] : []}
            onAddTag={(tag) => {
              if (singleMediaItem?.id) {
                const newTags = { ...userTags };
                newTags[singleMediaItem.id] = [
                  ...(newTags[singleMediaItem.id] || []),
                  tag,
                ];
                onUserTagsChange(newTags);
              }
            }}
            onRemoveTag={(idx) => {
              if (singleMediaItem?.id) {
                const newTags = { ...userTags };
                if (newTags[singleMediaItem.id]) {
                  newTags[singleMediaItem.id] = newTags[singleMediaItem.id].filter(
                    (_, i) => i !== idx
                  );
                  if (newTags[singleMediaItem.id].length === 0) {
                    delete newTags[singleMediaItem.id];
                  }
                }
                onUserTagsChange(newTags);
              }
            }}
            coverUrl={coverUrl}
            onVideoMetadataLoaded={setVideoDuration}
            isStory={postType === "story"}
          />
        )}

        {/* Post Footer (Caption, Icons) - Only in Post Mode */}
        {viewMode === "post" && (
          <InstagramPostFooter
            primaryName={primaryName}
            caption={caption}
            collaborators={collaborators}
          />
        )}

        {/* Toolbar (Crop, Tag, View Switch) */}
        <div className="px-3 py-2 border-t border-border">
          <InstagramToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            canCrop={canCrop}
            onCropClick={handleCropClick}
            isFetchingOriginal={isFetchingOriginal}
            isTaggingSupported={isTaggingSupported}
            isTaggingMode={isTaggingMode}
            onToggleTagging={() => setIsTaggingMode(!isTaggingMode)}
            displayMediaSrc={displayMediaSrc}
            isStory={postType === "story"}
          />
        </div>

        {/* Location Input */}
        <div className="px-3 py-2 border-t border-border">
          <LocationSearchInput
            initialLocation={location}
            onLocationSelect={(newLocation) =>
              setState({
                location: newLocation || { id: null, name: "" },
              })
            }
            integrationId={integrationId || null}
            isEnabled={true}
          />
        </div>
      </div>

      {/* Reel Options Panel - Only for single video posts, not carousels */}
      {postType === "post" &&
        mediaType === "video" &&
        displayMediaSrc &&
        !isCarousel && (
          <InstagramReelOptions
            integrationId={integrationId}
            shareToFeed={shareToFeed}
            onShareToFeedChange={onShareToFeedChange}
            coverUrl={coverUrl}
            onCoverChange={onCoverChange}
            displayMediaSrc={displayMediaSrc}
            thumbOffset={thumbOffset}
            onThumbOffsetChange={onThumbOffsetChange}
            videoDuration={videoDuration}
          />
        )}

      {/* Cropper Modal */}
      {originalMediaSrc && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={originalMediaSrc}
          platform="instagram"
          postType={postType}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}

export default memo(InstagramPreview);
