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
import { X, Check, RotateCcw, Crop as CropIcon, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type SocialPlatform,
  type AspectRatioPreset,
  PLATFORM_ASPECT_RATIOS,
  getDefaultAspectRatio,
} from "@/lib/utils/crop-utils";

interface ImageCropperModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  platform: SocialPlatform;
  postType?: "post" | "reel" | "story";
  initialCrop?: PixelCrop;
  initialAspectRatio?: number;
  onCropComplete: (
    croppedAreaPixels: PixelCrop,
    aspectRatio: number,
    displayedWidth: number,
    displayedHeight: number
  ) => void;
}

// Helper: Calculate a centered crop based on aspect ratio
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100, // CHANGED: 90 -> 100 to make the crop box full width/height
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
  imageSrc,
  platform,
  postType,
  initialCrop,
  initialAspectRatio,
  onCropComplete,
}: ImageCropperModalProps) {
  // Keyboard trap for Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Lock scroll when open
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
      imageSrc={imageSrc}
      platform={platform}
      postType={postType}
      initialCrop={initialCrop}
      initialAspectRatio={initialAspectRatio}
      onCropComplete={onCropComplete}
    />
  );
}

interface ImageCropperModalContentProps {
  onClose: () => void;
  imageSrc: string;
  platform: SocialPlatform;
  postType?: "post" | "reel" | "story";
  initialCrop?: PixelCrop;
  initialAspectRatio?: number;
  onCropComplete: (
    croppedAreaPixels: PixelCrop,
    aspectRatio: number,
    displayedWidth: number,
    displayedHeight: number
  ) => void;
}

function ImageCropperModalContent({
  onClose,
  imageSrc,
  platform,
  postType,
  initialCrop,
  initialAspectRatio,
  onCropComplete,
}: ImageCropperModalContentProps) {
  // 1. Determine available presets
  const presets = PLATFORM_ASPECT_RATIOS[platform].filter((preset) => {
    const isStoryPreset = preset.label.toLowerCase().includes("story");
    if (postType === "post" && isStoryPreset) return false;
    if (postType === "story" && !isStoryPreset) return false;
    return true;
  });

  // 2. Determine default aspect ratio
  const getDefaultAspect = () => {
    if (initialAspectRatio) return initialAspectRatio;
    if (postType === "story") return 9 / 16;
    return getDefaultAspectRatio(platform);
  };

  // State
  const [aspectRatio, setAspectRatio] = useState<number>(getDefaultAspect());
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(
    initialCrop ?? null
  );

  const imgRef = useRef<HTMLImageElement>(null);

  // 3. Image Load Handler
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height, naturalWidth, naturalHeight } = e.currentTarget;

      if (initialCrop && initialCrop.width > 0 && initialCrop.height > 0) {
        // RECOVERY LOGIC:
        const percentCrop: Crop = {
          unit: "%",
          x: (initialCrop.x / naturalWidth) * 100,
          y: (initialCrop.y / naturalHeight) * 100,
          width: (initialCrop.width / naturalWidth) * 100,
          height: (initialCrop.height / naturalHeight) * 100,
        };
        setCrop(percentCrop);

        const displayPixelCrop: PixelCrop = {
          unit: "px",
          x: (initialCrop.x / naturalWidth) * width,
          y: (initialCrop.y / naturalHeight) * height,
          width: (initialCrop.width / naturalWidth) * width,
          height: (initialCrop.height / naturalHeight) * height,
        };
        setCompletedCrop(displayPixelCrop);
      } else {
        // NEW CROP LOGIC:
        const newCrop = centerAspectCrop(width, height, aspectRatio);
        setCrop(newCrop);
      }
    },
    [initialCrop, aspectRatio]
  );

  const handleSave = () => {
    if (
      completedCrop &&
      completedCrop.width > 0 &&
      completedCrop.height > 0 &&
      imgRef.current
    ) {
      onCropComplete(
        completedCrop,
        aspectRatio,
        imgRef.current.width,
        imgRef.current.height
      );
      onClose();
    }
  };

  const handleAspectChange = (preset: AspectRatioPreset) => {
    setAspectRatio(preset.value);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      // This will now use width: 100 to maximize the crop box
      const newCrop = centerAspectCrop(width, height, preset.value);
      setCrop(newCrop);

      // Re-calculate completed crop immediately
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
    const def = getDefaultAspectRatio(platform);
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
        {/* --- LEFT PANEL: Controls --- */}
        <div className="flex w-80 flex-col border-r border-white/10 bg-[#222]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Transform</h2>
              <p className="text-xs text-neutral-400 capitalize">
                For {platform}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2 text-xs text-neutral-400 hover:text-white"
            >
              <RotateCcw className="mr-1.5 h-3 w-3" />
              Reset
            </Button>
          </div>

          {/* Presets List */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Aspect Ratio
              </label>
              <div className="grid gap-2">
                {presets.map((preset) => {
                  const isActive = Math.abs(aspectRatio - preset.value) < 0.01;

                  // Dynamic icon calculation
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

            <div className="mt-6 rounded-md bg-white/5 p-4">
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
          <div className="border-t border-white/10 p-5">
            <div className="grid gap-3">
              <Button
                onClick={handleSave}
                className="w-full bg-white text-black hover:bg-neutral-200"
              >
                <Check className="mr-2 h-4 w-4" />
                Apply Crop
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-neutral-400 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: Canvas --- */}
        <div className="flex flex-1 items-center justify-center overflow-hidden bg-[#0a0a0a] p-8 relative">
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
              src={imageSrc}
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

          {/* Close X */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white/70 hover:bg-black/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
