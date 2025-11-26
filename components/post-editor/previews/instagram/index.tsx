// components/post-editor/previews/instagram/index.tsx

"use client";

import { memo, useState, useRef, useEffect } from "react";
import { UserTagDto, ProductTagDto } from "@/lib/api/publishing";
import { Product } from "@/lib/api/commerce";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { AltTextModal } from "../../modals/alt-text-modal";
import { ProductSelectorModal } from "../../modals/product-selector-modal";
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
import CollaboratorSearchInput from "../../collaborator-search-input";

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
  productTags: Record<string, ProductTagDto[]>; // Keyed by mediaId
  onProductTagsChange: (tags: Record<string, ProductTagDto[]>) => void;
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
  productTags,
  onProductTagsChange,
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
  const instagramCollaborators = useEditorialStore((state) => state.instagramCollaborators);

  // Local State
  const [isTaggingMode, setIsTaggingMode] = useState(false);
  const [isProductTaggingMode, setIsProductTaggingMode] = useState(false);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [pendingProductTag, setPendingProductTag] = useState<{
    mediaId: string;
    x: number;
    y: number;
  } | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isAltTextModalOpen, setIsAltTextModalOpen] = useState(false);
  const [altTextInitialIndex, setAltTextInitialIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"post" | "grid">("post");
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const integrationId = selectedAccounts["instagram"]?.[0];

  // Derived Values
  const displayMediaSrc =
    singleMediaItem?.croppedPreviews?.instagram || singleMediaItem?.preview;

  const previewAspectRatio = postType === "story" ? 9 / 16 : aspectRatio;

  // Determine if we have multiple media items
  const hasMultipleMedia = mediaItems.length > 1;
  const isCarousel = hasMultipleMedia && postType === "post";
  const isStoryCarousel = hasMultipleMedia && postType === "story";

  // For carousel mode, get the current media item
  const currentCarouselMedia = isCarousel
    ? mediaItems[currentCarouselIndex]
    : null;

  // Determine which media to use for cropping: carousel item or single item
  const activeMediaForCrop = currentCarouselMedia || singleMediaItem;

  // Can crop if we have an uploaded image (either single or in carousel)
  const canCrop =
    !!activeMediaForCrop?.id && activeMediaForCrop?.type === "image";

  // For cropper modal: use the active media item
  const originalMediaSrc = activeMediaForCrop?.file
    ? activeMediaForCrop.preview
    : activeMediaForCrop?.originalUrlForCropping;

  // For carousels, tagging is supported if ANY image exists
  // For single media, tagging is supported if it's a post with an image
  const isTaggingSupported = isCarousel
    ? postType === "post" && mediaItems.some((item) => item.type === "image")
    : !!displayMediaSrc && postType === "post" && mediaType !== "video";

  // Product tagging follows the same rules as user tagging
  const isProductTaggingSupported = isTaggingSupported;

  // Alt text editing: Filter to only uploaded images
  const editableMediaItems = isCarousel
    ? mediaItems.filter((item) => item.type === "image" && !!item.id)
    : singleMediaItem?.type === "image" && singleMediaItem?.id
    ? [singleMediaItem]
    : [];

  const canEditAltText = editableMediaItems.length > 0;

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

  useEffect(() => {
    if (!isProductTaggingSupported) {
      setIsProductTaggingMode(false);
    }
  }, [isProductTaggingSupported]);

  // Auto-crop logic for Stories (only for single media, not carousel)
  const prevPostTypeRef = useRef(postType);
  useEffect(() => {
    const applyAutoCrop = async () => {
      // Skip auto-crop if we're in carousel mode
      if (!singleMediaItem || isCarousel) return;

      const singleMediaSrc = singleMediaItem.file
        ? singleMediaItem.preview
        : singleMediaItem.originalUrlForCropping;

      if (!singleMediaSrc) return;

      // Logic: If switching TO story from post
      if (prevPostTypeRef.current !== "story" && postType === "story") {
        try {
          const img = new window.Image();
          img.src = singleMediaSrc;
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
            singleMediaSrc,
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
  }, [postType, aspectRatio, singleMediaItem, isCarousel]);

  // Handlers
  const onCropComplete = (
    cropData: CropData | undefined,
    croppedPreviewUrl: string
  ) => {
    // Use activeMediaForCrop (handles both carousel and single media)
    if (activeMediaForCrop) {
      setCropForMedia(
        activeMediaForCrop.uid,
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
    // Use activeMediaForCrop which already handles carousel vs single media
    if (
      !activeMediaForCrop ||
      !activeMediaForCrop.id ||
      activeMediaForCrop.type !== "image"
    ) {
      return;
    }

    if (activeMediaForCrop.originalUrlForCropping) {
      setIsCropperOpen(true);
      return;
    }

    setIsFetchingOriginal(true);
    try {
      if (!integrationId) throw new Error("Instagram account not selected.");
      const { downloadUrl } = await getMediaViewUrl(
        activeMediaForCrop.id,
        integrationId
      );

      // Update store so next time we don't fetch
      const currentItems = useEditorialStore.getState().stagedMediaItems;
      const updatedItems = currentItems.map((item) =>
        item.uid === activeMediaForCrop.uid
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

  const handleAltTextClick = () => {
    // Set initial index based on current view
    if (isCarousel) {
      // Find the index of current carousel item in editable items
      const currentMedia = mediaItems[currentCarouselIndex];
      const editableIndex = editableMediaItems.findIndex(
        (item) => item.uid === currentMedia.uid
      );
      setAltTextInitialIndex(editableIndex >= 0 ? editableIndex : 0);
    } else {
      setAltTextInitialIndex(0);
    }
    setIsAltTextModalOpen(true);
  };

  // Product Tagging Handlers
  const handleProductTagClick = (mediaId: string, x: number, y: number) => {
    setPendingProductTag({ mediaId, x, y });
    setIsProductSelectorOpen(true);
  };

  const handleProductSelected = (product: Product) => {
    if (!pendingProductTag) return;

    const { mediaId, x, y } = pendingProductTag;
    const newTags = { ...productTags };
    newTags[mediaId] = [
      ...(newTags[mediaId] || []),
      { productId: product.id, x, y },
    ];
    onProductTagsChange(newTags);

    setPendingProductTag(null);
    setIsProductSelectorOpen(false);
  };

  const handleRemoveProductTag = (mediaId: string, index: number) => {
    const newTags = { ...productTags };
    if (newTags[mediaId]) {
      newTags[mediaId] = newTags[mediaId].filter((_, i) => i !== index);
      if (newTags[mediaId].length === 0) {
        delete newTags[mediaId];
      }
    }
    onProductTagsChange(newTags);
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
            isProductTaggingMode={isProductTaggingMode}
            productTags={productTags}
            onProductTagClick={handleProductTagClick}
            onRemoveProductTag={handleRemoveProductTag}
            onVideoMetadataLoaded={setVideoDuration}
            onCurrentIndexChange={setCurrentCarouselIndex}
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
                  newTags[singleMediaItem.id] = newTags[
                    singleMediaItem.id
                  ].filter((_, i) => i !== idx);
                  if (newTags[singleMediaItem.id].length === 0) {
                    delete newTags[singleMediaItem.id];
                  }
                }
                onUserTagsChange(newTags);
              }
            }}
            isProductTaggingMode={isProductTaggingMode}
            productTags={
              singleMediaItem?.id ? productTags[singleMediaItem.id] || [] : []
            }
            onProductTagClick={(x, y) => {
              if (singleMediaItem?.id) {
                handleProductTagClick(singleMediaItem.id, x, y);
              }
            }}
            onRemoveProductTag={(idx) => {
              if (singleMediaItem?.id) {
                handleRemoveProductTag(singleMediaItem.id, idx);
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

        {/* Toolbar (Crop, Tag, Alt, View Switch) */}
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
            isProductTaggingSupported={isProductTaggingSupported}
            isProductTaggingMode={isProductTaggingMode}
            onToggleProductTagging={() =>
              setIsProductTaggingMode(!isProductTaggingMode)
            }
            displayMediaSrc={displayMediaSrc}
            isStory={postType === "story"}
            canEditAltText={canEditAltText}
            onAltTextClick={handleAltTextClick}
          />
        </div>

        {/* Collaborator Search - Only for Instagram posts (not stories) */}
        {postType !== "story" && (
          <div className="px-3 py-2 border-t border-border">
            <CollaboratorSearchInput
              selectedCollaborators={instagramCollaborators}
              onCollaboratorsChange={(collaborators) =>
                setState({ instagramCollaborators: collaborators })
              }
              integrationId={integrationId || null}
            />
          </div>
        )}

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
          initialCrop={activeMediaForCrop?.crops?.instagram?.croppedAreaPixels}
          initialAspectRatio={activeMediaForCrop?.crops?.instagram?.aspectRatio}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Alt Text Modal */}
      {editableMediaItems.length > 0 && (
        <AltTextModal
          open={isAltTextModalOpen}
          onClose={() => setIsAltTextModalOpen(false)}
          mediaItems={editableMediaItems}
          initialMediaIndex={altTextInitialIndex}
        />
      )}

      {/* Product Selector Modal */}
      <ProductSelectorModal
        open={isProductSelectorOpen}
        onClose={() => {
          setIsProductSelectorOpen(false);
          setPendingProductTag(null);
        }}
        onSelectProduct={handleProductSelected}
        integrationId={integrationId || null} // <--- PASS IT HERE
      />
    </div>
  );
}

export default memo(InstagramPreview);
