// components/post-editor/previews/instagram/index.tsx

"use client";

import { memo, useState, useRef, useEffect } from "react";
import { UserTagDto, ProductTagDto } from "@/lib/api/publishing";
import { Product } from "@/lib/api/commerce";
import { ImageCropperModal } from "../../modals/image-cropper-modal";
import { AltTextModal } from "../../modals/alt-text-modal";
import { ProductSelectorModal } from "../../modals/product-selector-modal";
import {
  createCroppedPreviewUrl,
  type CropData,
  STORY_ASPECT_RATIO,
  calculateCenteredCrop,
} from "@/lib/utils/crop-utils";
import {
  MediaItem,
  useEditorialDraftStore,
} from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useClientData } from "@/lib/hooks/use-client-data";
import { useOriginalUrl } from "@/lib/hooks/use-original-url";
import { Grid3X3, Square } from "lucide-react";
import { cn } from "@/lib/utils";

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
  userTags: Record<string, UserTagDto[]>;
  onUserTagsChange: (tags: Record<string, UserTagDto[]>) => void;
  productTags: Record<string, ProductTagDto[]>;
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

  const setCropForMedia = useEditorialDraftStore(
    (state) => state.setCropForMedia
  );
  const location = usePublishingStore((state) => state.location);
  const selectedAccounts = usePublishingStore(
    (state) => state.selectedAccounts
  );
  const { organizationId } = useClientData();
  const { getOriginalUrl } = useOriginalUrl(organizationId);
  const integrationId = selectedAccounts["instagram"]?.[0];

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
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const displayMediaSrc =
    singleMediaItem?.croppedPreviews?.instagram ||
    (singleMediaItem?.type === "video" && singleMediaItem.mediaUrl
      ? singleMediaItem.mediaUrl
      : singleMediaItem?.preview);
  const previewAspectRatio = postType === "story" ? 9 / 16 : aspectRatio;
  const hasMultipleMedia = mediaItems.length > 1;
  const isCarousel = hasMultipleMedia && postType === "post";
  const isStoryCarousel = hasMultipleMedia && postType === "story";
  const currentCarouselMedia = isCarousel
    ? mediaItems[currentCarouselIndex]
    : null;
  const activeMediaForCrop = currentCarouselMedia || singleMediaItem;
  const canCrop =
    !!activeMediaForCrop?.id && activeMediaForCrop?.type === "image";
  const isTaggingSupported = isCarousel
    ? postType === "post" && mediaItems.some((item) => item.type === "image")
    : !!displayMediaSrc && postType === "post" && mediaType !== "video";
  const isProductTaggingSupported = isTaggingSupported;
  const editableMediaItems = isCarousel
    ? mediaItems.filter((item) => item.type === "image" && !!item.id)
    : singleMediaItem?.type === "image" && singleMediaItem?.id
    ? [singleMediaItem]
    : [];
  const canEditAltText = editableMediaItems.length > 0;

  const prevPostTypeRef = useRef(postType);

  useEffect(() => {
    if (postType === "story") setViewMode("post");
  }, [postType]);

  useEffect(() => {
    if (!isTaggingSupported) setIsTaggingMode(false);
  }, [isTaggingSupported]);

  useEffect(() => {
    if (!isProductTaggingSupported) setIsProductTaggingMode(false);
  }, [isProductTaggingSupported]);

  useEffect(() => {
    const applyAutoCrop = async () => {
      if (!singleMediaItem || isCarousel) return;
      const singleMediaSrc = singleMediaItem.file
        ? singleMediaItem.preview
        : singleMediaItem.originalUrlForCropping;
      if (!singleMediaSrc) return;

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
          if (activeMediaForCrop) {
            setCropForMedia(
              activeMediaForCrop.uid,
              "instagram",
              {
                croppedAreaPixels: cropPixels,
                aspectRatio: STORY_ASPECT_RATIO,
              },
              croppedUrl
            );
          }
        } catch (error) {
          console.error("Failed to auto-crop for story:", error);
        }
      } else if (
        prevPostTypeRef.current === "story" &&
        postType === "post" &&
        aspectRatio === STORY_ASPECT_RATIO
      ) {
        if (activeMediaForCrop) {
          setCropForMedia(
            activeMediaForCrop.uid,
            "instagram",
            undefined as any,
            ""
          );
        }
      }
      prevPostTypeRef.current = postType;
    };
    applyAutoCrop();
  }, [
    postType,
    aspectRatio,
    singleMediaItem,
    isCarousel,
    activeMediaForCrop,
    setCropForMedia,
  ]);

  const handleCropClick = () => setIsCropperOpen(true);
  const handleCropSave = (
    mediaUid: string,
    cropData: CropData,
    previewUrl: string
  ) => {
    setCropForMedia(mediaUid, "instagram", cropData, previewUrl);
  };

  const handleAltTextClick = () => {
    if (isCarousel) {
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
      if (newTags[mediaId].length === 0) delete newTags[mediaId];
    }
    onProductTagsChange(newTags);
  };

  const cropperInitialIndex = isCarousel ? currentCarouselIndex : 0;
  const cropperMediaItems =
    mediaItems.length > 0
      ? mediaItems
      : singleMediaItem
      ? [singleMediaItem]
      : [];

  return (
    <div className="w-full max-w-[360px] mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-surface border border-border shadow-sm rounded-md overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="relative">
          <InstagramHeader
            avatarUrl={avatarUrl}
            primaryName={primaryName}
            location={location.name}
          />
          {postType !== "story" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 bg-muted/50 p-0.5 rounded-md">
              <button
                onClick={() => setViewMode("post")}
                className={cn(
                  "p-1 rounded-sm transition-all",
                  viewMode === "post"
                    ? "bg-white shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Post View"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1 rounded-sm transition-all",
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Grid View"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

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
                if (newTags[mediaId].length === 0) delete newTags[mediaId];
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
                  if (newTags[singleMediaItem.id].length === 0)
                    delete newTags[singleMediaItem.id];
                }
                onUserTagsChange(newTags);
              }
            }}
            isProductTaggingMode={isProductTaggingMode}
            productTags={
              singleMediaItem?.id ? productTags[singleMediaItem.id] || [] : []
            }
            onProductTagClick={(x, y) => {
              if (singleMediaItem?.id)
                handleProductTagClick(singleMediaItem.id, x, y);
            }}
            onRemoveProductTag={(idx) => {
              if (singleMediaItem?.id)
                handleRemoveProductTag(singleMediaItem.id, idx);
            }}
            coverUrl={coverUrl}
            onVideoMetadataLoaded={setVideoDuration}
            isStory={postType === "story"}
          />
        )}

        {viewMode === "post" && (
          <InstagramPostFooter
            primaryName={primaryName}
            caption={caption}
            collaborators={collaborators}
          />
        )}

        <InstagramToolbar
          viewMode={viewMode}
          canCrop={canCrop}
          onCropClick={handleCropClick}
          isFetchingOriginal={false}
          isTaggingSupported={isTaggingSupported}
          isTaggingMode={isTaggingMode}
          onToggleTagging={() => setIsTaggingMode(!isTaggingMode)}
          isProductTaggingSupported={isProductTaggingSupported}
          isProductTaggingMode={isProductTaggingMode}
          onToggleProductTagging={() =>
            setIsProductTaggingMode(!isProductTaggingMode)
          }
          displayMediaSrc={displayMediaSrc}
          canEditAltText={canEditAltText}
          onAltTextClick={handleAltTextClick}
        />
      </div>

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

      {isCropperOpen && (
        <ImageCropperModal
          open={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          mediaItems={cropperMediaItems}
          initialIndex={cropperInitialIndex}
          platform="instagram"
          postType={postType}
          onCropSave={handleCropSave}
          getOriginalUrl={getOriginalUrl}
        />
      )}

      {editableMediaItems.length > 0 && (
        <AltTextModal
          open={isAltTextModalOpen}
          onClose={() => setIsAltTextModalOpen(false)}
          mediaItems={editableMediaItems}
          initialMediaIndex={altTextInitialIndex}
        />
      )}

      <ProductSelectorModal
        open={isProductSelectorOpen}
        onClose={() => {
          setIsProductSelectorOpen(false);
          setPendingProductTag(null);
        }}
        onSelectProduct={handleProductSelected}
        integrationId={integrationId || null}
      />
    </div>
  );
}

export default memo(InstagramPreview);
