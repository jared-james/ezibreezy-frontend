// components/post-editor/modals/image-cropper-modal.tsx

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  X,
  Check,
  RotateCcw,
  Crop as CropIcon,
  Move,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type SocialPlatform,
  type AspectRatioPreset,
  PLATFORM_ASPECT_RATIOS,
  getDefaultAspectRatio,
  type CropData,
} from "@/lib/utils/crop-utils";
import { MediaItem } from "@/lib/store/editorial-store";

interface ImageCropperModalProps {
  open: boolean;
  onClose: () => void;
  mediaItems: MediaItem[];
  initialIndex: number;
  platform: SocialPlatform;
  postType?: "post" | "reel" | "story";
  onCropSave: (
    mediaUid: string,
    cropData: CropData,
    previewUrl: string
  ) => void;
  getOriginalUrl?: (item: MediaItem) => Promise<string | null>;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageCropperModal({
  open,
  onClose,
  mediaItems,
  initialIndex,
  platform,
  postType,
  onCropSave,
  getOriginalUrl,
}: ImageCropperModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <ImageCropperModalContent
      onClose={onClose}
      mediaItems={mediaItems}
      initialIndex={initialIndex}
      platform={platform}
      postType={postType}
      onCropSave={onCropSave}
      getOriginalUrl={getOriginalUrl}
    />
  );
}

interface ImageCropperModalContentProps {
  onClose: () => void;
  mediaItems: MediaItem[];
  initialIndex: number;
  platform: SocialPlatform;
  postType?: "post" | "reel" | "story";
  onCropSave: (
    mediaUid: string,
    cropData: CropData,
    previewUrl: string
  ) => void;
  getOriginalUrl?: (item: MediaItem) => Promise<string | null>;
}

function ImageCropperModalContent({
  onClose,
  mediaItems,
  initialIndex,
  platform,
  postType,
  onCropSave,
  getOriginalUrl,
}: ImageCropperModalContentProps) {
  const imageItems = mediaItems.filter((m) => m.type === "image");

  const initialMediaItem = mediaItems[initialIndex];
  const initialImageIndex = imageItems.findIndex(
    (img) => img.uid === initialMediaItem?.uid
  );

  const [currentIndex, setCurrentIndex] = useState(
    initialImageIndex >= 0 ? initialImageIndex : 0
  );

  const currentItem = imageItems[currentIndex];

  const savedCropData = currentItem?.crops?.[platform];
  const initialAspectRatio = savedCropData?.aspectRatio;
  const initialCrop = savedCropData?.croppedAreaPixels;

  const presets = PLATFORM_ASPECT_RATIOS[platform].filter((preset) => {
    const isStoryPreset = preset.label.toLowerCase().includes("story");
    if (postType === "post" && isStoryPreset) return false;
    if (postType === "story" && !isStoryPreset) return false;
    return true;
  });

  const getDefaultAspect = () => {
    if (initialAspectRatio) return initialAspectRatio;
    if (postType === "story") return 9 / 16;
    return getDefaultAspectRatio(platform);
  };

  const [aspectRatio, setAspectRatio] = useState<number>(getDefaultAspect());
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(
    initialCrop ?? null
  );
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(
    currentItem?.originalUrlForCropping || currentItem?.preview || ""
  );
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadSource = async () => {
      if (!currentItem) return;

      const itemCrop = currentItem.crops?.[platform];
      setCompletedCrop(itemCrop?.croppedAreaPixels ?? null);

      // FIX: Ensure Story uses 9:16 by default when switching/loading images
      const defaultAspect =
        postType === "story" ? 9 / 16 : getDefaultAspectRatio(platform);
      setAspectRatio(itemCrop?.aspectRatio ?? defaultAspect);

      setCrop(undefined);

      if (currentItem.originalUrlForCropping) {
        setCurrentImageSrc(currentItem.originalUrlForCropping);
        return;
      }

      if (currentItem.file) {
        setCurrentImageSrc(currentItem.preview);
        return;
      }

      if (getOriginalUrl) {
        setIsLoadingImage(true);
        try {
          const url = await getOriginalUrl(currentItem);
          if (url) {
            setCurrentImageSrc(url);
          } else {
            setCurrentImageSrc(currentItem.preview);
          }
        } catch (e) {
          console.error("Failed to load original", e);
          setCurrentImageSrc(currentItem.preview);
        } finally {
          setIsLoadingImage(false);
        }
      } else {
        setCurrentImageSrc(currentItem.preview);
      }
    };

    loadSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentItem?.uid]);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height, naturalWidth, naturalHeight } = e.currentTarget;

      const itemCrop = currentItem?.crops?.[platform];
      const savedPixels = itemCrop?.croppedAreaPixels;

      if (savedPixels && savedPixels.width > 0 && savedPixels.height > 0) {
        const percentCrop: Crop = {
          unit: "%",
          x: (savedPixels.x / naturalWidth) * 100,
          y: (savedPixels.y / naturalHeight) * 100,
          width: (savedPixels.width / naturalWidth) * 100,
          height: (savedPixels.height / naturalHeight) * 100,
        };
        setCrop(percentCrop);

        const displayPixelCrop: PixelCrop = {
          unit: "px",
          x: (savedPixels.x / naturalWidth) * width,
          y: (savedPixels.y / naturalHeight) * height,
          width: (savedPixels.width / naturalWidth) * width,
          height: (savedPixels.height / naturalHeight) * height,
        };
        setCompletedCrop(displayPixelCrop);
      } else {
        const newCrop = centerAspectCrop(width, height, aspectRatio);
        setCrop(newCrop);
      }
    },
    [currentItem, platform, aspectRatio]
  );

  const handleSave = async () => {
    if (
      completedCrop &&
      completedCrop.width > 0 &&
      completedCrop.height > 0 &&
      imgRef.current &&
      currentItem
    ) {
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const naturalCrop: PixelCrop = {
        unit: "px",
        x: Math.round(completedCrop.x * scaleX),
        y: Math.round(completedCrop.y * scaleY),
        width: Math.round(completedCrop.width * scaleX),
        height: Math.round(completedCrop.height * scaleY),
      };

      const cropData: CropData = {
        croppedAreaPixels: naturalCrop,
        aspectRatio: aspectRatio,
      };

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = naturalCrop.width;
      canvas.height = naturalCrop.height;

      ctx.drawImage(
        imgRef.current,
        naturalCrop.x,
        naturalCrop.y,
        naturalCrop.width,
        naturalCrop.height,
        0,
        0,
        naturalCrop.width,
        naturalCrop.height
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.95)
      );

      if (blob) {
        const previewUrl = URL.createObjectURL(blob);
        onCropSave(currentItem.uid, cropData, previewUrl);

        if (imageItems.length === 1) {
          onClose();
        }
      }
    }
  };

  const handleAspectChange = (preset: AspectRatioPreset) => {
    setAspectRatio(preset.value);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, preset.value);
      setCrop(newCrop);

      setCompletedCrop({
        unit: "px",
        x: (newCrop.x / 100) * width,
        y: (newCrop.y / 100) * height,
        width: (newCrop.width / 100) * width,
        height: (newCrop.height / 100) * height,
      });
    }
  };

  const handleReset = () => {
    // FIX: Ensure Reset also respects postType
    const def = postType === "story" ? 9 / 16 : getDefaultAspectRatio(platform);
    setAspectRatio(def);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, def);
      setCrop(newCrop);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="flex h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-[#1a1a1a] shadow-2xl border border-white/10">
        {/* --- LEFT PANEL: Controls & Thumbnails --- */}
        <div className="flex w-80 flex-col border-r border-white/10 bg-[#222]">
          <div className="p-5 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <CropIcon className="h-4 w-4" />
              Transform
            </h2>
            <p className="text-xs text-neutral-400 capitalize mt-1">
              For {platform}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* THUMBNAILS */}
            {imageItems.length > 1 && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <ImageIcon className="h-3 w-3" />
                  Select Image
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {imageItems.map((item, idx) => {
                    const isSelected = idx === currentIndex;
                    const thumbnailSrc =
                      item.croppedPreviews?.[platform] || item.preview;

                    return (
                      <button
                        key={item.uid}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                          "relative aspect-square w-full overflow-hidden rounded-md border-2 transition-all",
                          isSelected
                            ? "border-brand-primary ring-2 ring-brand-primary/20"
                            : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                        )}
                        title={`Image ${idx + 1}`}
                      >
                        <img
                          src={thumbnailSrc}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        {item.crops?.[platform] && !isSelected && (
                          <div className="absolute top-0 right-0 p-0.5 bg-brand-primary/80 text-white rounded-bl-sm backdrop-blur-sm">
                            <Check className="w-2 h-2" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-brand-primary/10" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PRESETS */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Aspect Ratio
              </label>

              <div className="grid gap-2">
                {presets.map((preset) => {
                  const isActive = Math.abs(aspectRatio - preset.value) < 0.01;
                  const isLandscape = preset.value > 1;
                  const w = isLandscape ? 20 : 20 * preset.value;
                  const h = isLandscape ? 20 / preset.value : 20;

                  return (
                    <button
                      key={preset.label}
                      onClick={() => handleAspectChange(preset)}
                      className={cn(
                        "flex items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                        isActive
                          ? "border-brand-primary bg-brand-primary/10 text-white"
                          : "border-white/10 text-neutral-400 hover:border-white/20 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex w-6 items-center justify-center">
                        <div
                          className={cn(
                            "border-2",
                            isActive
                              ? "border-brand-primary"
                              : "border-neutral-500"
                          )}
                          style={{ width: w, height: h }}
                        />
                      </div>
                      <span className="font-medium">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div className="rounded-md border border-border bg-white/5 p-4">
              <div className="flex gap-3 text-neutral-400">
                <Move className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-xs leading-relaxed">
                  Drag corners to resize. <br />
                  Drag inside to move.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-white/10 bg-[#222]">
            <div className="grid gap-3">
              <Button
                onClick={handleSave}
                className="w-full bg-white text-black hover:bg-neutral-200 uppercase tracking-widest font-bold text-xs"
              >
                <Check className="mr-2 h-4 w-4" />
                Apply Crop
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-neutral-400 hover:text-white hover:bg-white/10 uppercase tracking-widest text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: Canvas Only --- */}
        <div className="flex flex-1 flex-col min-w-0 bg-[#0a0a0a]">
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
            {isLoadingImage && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50 backdrop-blur-sm">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            )}

            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="shadow-2xl"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <img
                ref={imgRef}
                src={currentImageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                crossOrigin="anonymous"
                style={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                }}
              />
            </ReactCrop>

            <div className="absolute top-4 right-4 flex gap-2 z-30">
              <button
                onClick={handleReset}
                className="rounded-full bg-black/50 p-2 text-white/70 hover:bg-black/80 hover:text-white transition-colors"
                title="Reset Crop"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="rounded-full bg-black/50 p-2 text-white/70 hover:bg-black/80 hover:text-white transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
