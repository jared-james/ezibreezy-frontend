// components/post-editor/instagram-preview.tsx

import { memo, useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ImageIcon,
  UserPlus,
  X,
  Crop,
  Grid3X3,
  Square,
  Upload,
  Film,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { renderCaptionWithHashtags } from "../../render-caption";
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
import { uploadMedia, getMediaViewUrl } from "@/lib/api/media";
import { toast } from "sonner";

interface InstagramPreviewProps {
  caption: string;
  singleMediaItem: MediaItem | null;
  mediaType?: "image" | "video" | "text";
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  collaborators: string;
  location: string;
  postType: "post" | "reel" | "story";
  userTags: UserTagDto[];
  onUserTagsChange: (tags: UserTagDto[]) => void;
  aspectRatio?: number;
  coverUrl?: string | null;
  onCoverChange?: (url: string | null) => void;
  thumbOffset?: number | null;
  onThumbOffsetChange?: (offset: number | null) => void;
  shareToFeed?: boolean;
  onShareToFeedChange?: (val: boolean) => void;
}

const ProfileAvatar = ({
  size,
  avatarUrl,
  primaryName,
}: {
  size: number;
  avatarUrl: string | null;
  primaryName: string;
}) => {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={`${primaryName} profile picture`}
        width={size}
        height={size}
        className="rounded-full border border-[--border] shrink-0 object-cover"
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-[--muted] border border-[--border] shrink-0"
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

function InstagramPreview({
  caption,
  singleMediaItem,
  mediaType = "image",
  platformUsername,
  displayName,
  avatarUrl,
  collaborators,
  location,
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
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const setCropForMedia = useEditorialStore((state) => state.setCropForMedia);

  const [isTaggingMode, setIsTaggingMode] = useState(false);
  const [localTags, setLocalTags] = useState<UserTagDto[]>(userTags);
  const [newTag, setNewTag] = useState<{
    x: number;
    y: number;
    username: string;
  } | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"post" | "grid">("post");
  const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);

  const [videoDuration, setVideoDuration] = useState(0);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const integrationId = selectedAccounts["instagram"]?.[0];

  const displayMediaSrc =
    singleMediaItem?.croppedPreviews?.instagram || singleMediaItem?.preview;
  const canCrop = singleMediaItem?.id && mediaType === "image";
  const originalMediaSrc = singleMediaItem?.file
    ? singleMediaItem.preview
    : singleMediaItem?.originalUrlForCropping;

  const isTaggingSupported =
    displayMediaSrc && postType === "post" && mediaType !== "video";

  const previewAspectRatio = postType === "story" ? 9 / 16 : aspectRatio;

  useEffect(() => {
    if (postType === "story") {
      setViewMode("post");
    }
  }, [postType]);

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

  const prevPostTypeRef = useRef(postType);
  useEffect(() => {
    const applyAutoCrop = async () => {
      if (!originalMediaSrc) return;

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

          const cropData: CropData = {
            croppedAreaPixels: cropPixels,
            aspectRatio: STORY_ASPECT_RATIO,
          };

          onCropComplete(cropData, croppedUrl);
        } catch (error) {
          console.error("Failed to auto-crop for story:", error);
        }
      } else if (
        prevPostTypeRef.current === "story" &&
        postType === "post" &&
        aspectRatio === STORY_ASPECT_RATIO
      ) {
        onCropComplete(undefined, "");
      }

      prevPostTypeRef.current = postType;
    };

    applyAutoCrop();
  }, [postType, aspectRatio, onCropComplete, originalMediaSrc]);

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

      const originalDimensions = await getOriginalDimensions(originalMediaSrc);
      const scalingFactor = originalDimensions.width / displayedWidth;

      const scaledCroppedAreaPixels: PixelCrop = {
        ...croppedAreaPixels,
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

      const cropData: CropData = {
        croppedAreaPixels: scaledCroppedAreaPixels,
        aspectRatio: newAspectRatio,
      };

      onCropComplete(cropData, croppedUrl);
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

      const currentItems = useEditorialStore.getState().stagedMediaItems;
      const updatedItems = currentItems.map((item) =>
        item.uid === singleMediaItem.uid
          ? { ...item, originalUrlForCropping: downloadUrl }
          : item
      );
      useEditorialStore.getState().setStagedMediaItems(updatedItems);

      setIsCropperOpen(true);
    } catch (error) {
      console.error("Failed to get view URL for cropping:", error);
      toast.error(
        "Could not load original image for cropping. Please try again."
      );
    } finally {
      setIsFetchingOriginal(false);
    }
  };

  useEffect(() => {
    setLocalTags(userTags);
  }, [userTags]);

  useEffect(() => {
    onUserTagsChange(localTags);
  }, [localTags, onUserTagsChange]);

  useEffect(() => {
    if (!isTaggingSupported) {
      setIsTaggingMode(false);
    }
  }, [isTaggingSupported]);

  const handleVideoMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoDuration(e.currentTarget.duration);
    if (thumbOffset && thumbOffset > 0) {
      e.currentTarget.currentTime = thumbOffset / 1000;
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeSeconds = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = timeSeconds;
    }
    if (onThumbOffsetChange) {
      onThumbOffsetChange(Math.floor(timeSeconds * 1000));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!integrationId) {
      toast.error("Please select an Instagram account first.");
      return;
    }

    try {
      setIsUploadingCover(true);
      const response = await uploadMedia(file, integrationId);
      onCoverChange?.(response.url);
      toast.success("Cover image uploaded");
    } catch (error) {
      toast.error("Failed to upload cover image");
      console.error(error);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTaggingMode || !mediaContainerRef.current) return;
    const rect = mediaContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setNewTag({ x, y, username: "" });
  };

  const handleAddTag = () => {
    if (newTag && newTag.username.trim()) {
      const finalTag = {
        ...newTag,
        username: newTag.username.trim().replace(/^@/, ""),
      };
      setLocalTags((prev) => [...prev, finalTag]);
      setNewTag(null);
    }
  };

  const handleRemoveTag = (index: number) => {
    setLocalTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4 transition-all duration-300">
      <div className="bg-[--surface] border border-[--border] shadow-lg">
        <div className="flex items-center justify-between p-3 border-b border-[--border]">
          <div className="flex items-center gap-3">
            <ProfileAvatar
              size={32}
              avatarUrl={avatarUrl}
              primaryName={primaryName}
            />
            <div>
              <span className="font-semibold text-sm text-[--foreground]">
                {primaryName}
              </span>
              {location && (
                <p className="text-xs text-[--muted-foreground] leading-none">
                  {location}
                </p>
              )}
            </div>
          </div>
          <div className="text-[--muted-foreground]">
            <span className="font-serif text-sm">...</span>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="bg-background p-2">
            <div className="grid grid-cols-3 gap-0.5">
              {[0, 1, 2].map((i) => (
                <div key={`top-${i}`} className="aspect-3/4 bg-muted" />
              ))}
              <div className="aspect-3/4 bg-muted" />
              <div className="aspect-3/4 relative overflow-hidden ring-2 ring-primary">
                {displayMediaSrc ? (
                  mediaType === "video" ? (
                    coverUrl ? (
                      <img
                        src={coverUrl}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={displayMediaSrc}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        ref={(el) => {
                          if (el && thumbOffset) {
                            el.currentTime = thumbOffset / 1000;
                          }
                        }}
                      />
                    )
                  ) : (
                    <img
                      src={displayMediaSrc}
                      alt="Grid Preview"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="aspect-3/4 bg-muted" />
              {[0, 1, 2].map((i) => (
                <div key={`bottom-${i}`} className="aspect-3/4 bg-muted" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Grid preview (3:4 crop)
            </p>
          </div>
        ) : (
          <div
            ref={mediaContainerRef}
            onClick={handleImageClick}
            className={cn(
              "relative bg-[--background]",
              displayMediaSrc
                ? ""
                : "aspect-square flex items-center justify-center",
              isTaggingMode && "cursor-crosshair"
            )}
            style={
              displayMediaSrc ? { aspectRatio: previewAspectRatio } : undefined
            }
          >
            {displayMediaSrc ? (
              mediaType === "video" ? (
                <video
                  ref={videoRef}
                  src={displayMediaSrc}
                  className="w-full h-full object-contain"
                  muted
                  controls={false}
                  autoPlay
                  loop
                  playsInline
                  onLoadedMetadata={handleVideoMetadata}
                  poster={coverUrl || undefined}
                />
              ) : (
                <img
                  src={displayMediaSrc}
                  alt="Media Preview"
                  className="w-full h-full object-contain"
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-[--muted-foreground] text-center p-12">
                <ImageIcon className="w-8 h-8 mb-2" />
                <p>No Image/Video Attached</p>
              </div>
            )}

            {isTaggingMode && (
              <div className="absolute inset-0 bg-black/30 p-2 flex flex-col justify-between pointer-events-none">
                <p className="text-center text-xs font-semibold text-white bg-black/50 rounded-full px-3 py-1 self-center">
                  Click on the photo to tag a user
                </p>
              </div>
            )}

            {localTags.map((tag, index) => (
              <div
                key={index}
                className="absolute group"
                style={{
                  left: `${tag.x * 100}%`,
                  top: `${tag.y * 100}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <div
                  className="relative flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-white shadow-lg"
                  style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
                >
                  <span>{tag.username}</span>
                  <button
                    onClick={() => handleRemoveTag(index)}
                    className="opacity-0 group-hover:opacity-100 ml-1 hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div
                    className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]"
                    style={{ borderTopColor: "rgba(0,0,0,0.85)" }}
                  />
                </div>
              </div>
            ))}

            {newTag && (
              <div
                className="absolute"
                style={{
                  left: `${newTag.x * 100}%`,
                  top: `${newTag.y * 100}%`,
                  transform: "translate(-50%, 8px)",
                }}
              >
                <div className="w-40 rounded bg-white p-1 shadow-lg">
                  <input
                    type="text"
                    autoFocus
                    placeholder="@username"
                    value={newTag.username}
                    onChange={(e) =>
                      setNewTag({ ...newTag, username: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    onBlur={handleAddTag}
                    className="w-full border-none bg-transparent px-2 py-1 text-sm outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === "post" && (
          <>
            <div className="flex justify-between p-3">
              <div className="flex items-center gap-4 text-muted-foreground">
                <Heart className="size-6 hover:text-foreground cursor-pointer" />
                <MessageCircle className="size-6 hover:text-foreground cursor-pointer" />
                <Send className="size-6 hover:text-foreground cursor-pointer" />
              </div>
              <Bookmark className="size-6 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>

            <div className="px-3 pb-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">0 likes</p>

              <div className="text-sm">
                <span className="font-semibold mr-1">{primaryName}</span>
                <span className="whitespace-pre-wrap">
                  {renderCaptionWithHashtags(caption)}
                </span>
              </div>

              {collaborators && (
                <p className="text-xs text-brand-primary">
                  With <span className="font-semibold">{collaborators}</span>
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                View all 0 comments
              </p>
              <p className="text-[0.65rem] uppercase text-muted-foreground">
                Now
              </p>
            </div>
          </>
        )}

        <div className="px-3 py-2 border-t border-border">
          {isTaggingSupported || canCrop || displayMediaSrc ? (
            <div className="flex items-center gap-4">
              {displayMediaSrc && postType !== "story" && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewMode("post")}
                    title="Post View"
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium transition-colors",
                      viewMode === "post"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Square className="h-3.5 w-3.5" />
                    Post
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    title="Grid View"
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium transition-colors",
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Grid3X3 className="h-3.5 w-3.5" />
                    Grid
                  </button>
                </div>
              )}

              {displayMediaSrc &&
                postType !== "story" &&
                (canCrop || isTaggingSupported) && (
                  <div className="h-4 w-px bg-border" />
                )}

              {canCrop && (
                <button
                  onClick={handleCropClick}
                  title="Crop Image"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isFetchingOriginal}
                >
                  {isFetchingOriginal ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Crop className="h-3.5 w-3.5" />
                  )}
                  Crop
                </button>
              )}
              {isTaggingSupported && (
                <button
                  onClick={() => {
                    if (viewMode === "grid") return;
                    if (isTaggingMode) {
                      setNewTag(null);
                    }
                    setIsTaggingMode(!isTaggingMode);
                  }}
                  title={
                    viewMode === "grid"
                      ? "Switch to Post view to tag"
                      : isTaggingMode
                      ? "Done Tagging"
                      : "Tag People"
                  }
                  disabled={viewMode === "grid"}
                  className={cn(
                    "flex items-center gap-1.5 text-xs transition-colors",
                    viewMode === "grid"
                      ? "text-muted-foreground/40 cursor-not-allowed"
                      : isTaggingMode
                      ? "text-brand-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  {isTaggingMode ? "Done" : "Tag"}
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Instagram Preview
            </p>
          )}
        </div>
      </div>

      {postType === "post" && mediaType === "video" && displayMediaSrc && (
        <div className="bg-surface border border-border rounded-lg p-4 space-y-5 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold text-foreground flex items-center gap-2">
              <Film className="w-4 h-4" />
              Reel Options
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-foreground">
                Share to Feed
              </label>
              <p className="text-xs text-muted-foreground">
                Also show this Reel on your main profile grid
              </p>
            </div>
            <input
              type="checkbox"
              checked={shareToFeed ?? true}
              onChange={(e) => onShareToFeedChange?.(e.target.checked)}
              className="h-4 w-4 rounded border-brand-primary accent-brand-primary"
            />
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Cover Image
            </label>

            <div className="flex gap-4 items-start">
              <div className="relative w-20 aspect-9/16 bg-muted border border-border rounded-md overflow-hidden shrink-0">
                {coverUrl ? (
                  <>
                    <img
                      src={coverUrl}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onCoverChange?.(null)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                ) : displayMediaSrc ? (
                  <video
                    src={displayMediaSrc}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    ref={(el) => {
                      if (
                        el &&
                        thumbOffset !== null &&
                        thumbOffset !== undefined
                      ) {
                        el.currentTime = thumbOffset / 1000;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-[10px] text-center p-1">
                    <span>Auto</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border hover:bg-surface-hover rounded-md text-xs font-medium cursor-pointer transition-colors">
                    {isUploadingCover ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    Upload Custom Cover
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg"
                      className="hidden"
                      onChange={handleCoverUpload}
                      disabled={isUploadingCover}
                    />
                  </label>
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    Must be a JPEG image (max 8MB). Overrides video frame.
                  </p>
                </div>

                {!coverUrl && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Select Frame</span>
                      <span>
                        {thumbOffset ? (thumbOffset / 1000).toFixed(1) : "0.0"}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={videoDuration || 100}
                      step={0.1}
                      value={thumbOffset ? thumbOffset / 1000 : 0}
                      onChange={handleSliderChange}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
