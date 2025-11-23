// components/post-editor/image-cropper-modal.tsx

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

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
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
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Lock body scroll
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
  // Filter crop presets based on post type
  const presets = PLATFORM_ASPECT_RATIOS[platform].filter((preset) => {
    const isStoryPreset = preset.label.toLowerCase().includes("story");
    // For posts: hide story presets
    if (postType === "post" && isStoryPreset) {
      return false;
    }
    // For stories: only show story presets
    if (postType === "story" && !isStoryPreset) {
      return false;
    }
    return true;
  });

  // Default to story aspect ratio (9:16) when postType is "story", otherwise use platform default
  const getDefaultAspect = () => {
    if (initialAspectRatio) return initialAspectRatio;
    if (postType === "story") return 9 / 16;
    return getDefaultAspectRatio(platform);
  };
  const defaultAspect = getDefaultAspect();

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(
    initialCrop ?? null
  );
  const [aspectRatio, setAspectRatio] = useState<number>(defaultAspect);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      if (initialCrop && initialCrop.width > 0 && initialCrop.height > 0) {
        const percentCrop: Crop = {
          unit: "%",
          x: (initialCrop.x / width) * 100,
          y: (initialCrop.y / height) * 100,
          width: (initialCrop.width / width) * 100,
          height: (initialCrop.height / height) * 100,
        };
        setCrop(percentCrop);
      } else {
        const newCrop = centerAspectCrop(width, height, aspectRatio);
        setCrop(newCrop);
      }
    },
    [initialCrop, aspectRatio]
  );

  const handleSave = useCallback(() => {
    if (
      completedCrop &&
      completedCrop.width > 0 &&
      completedCrop.height > 0 &&
      imgRef.current
    ) {
      const { width, height } = imgRef.current;
      onCropComplete(completedCrop, aspectRatio, width, height);
      onClose();
    }
  }, [completedCrop, aspectRatio, onCropComplete, onClose]);

  const handleAspectChange = useCallback((preset: AspectRatioPreset) => {
    setAspectRatio(preset.value);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, preset.value);
      setCrop(newCrop);
      // Convert percent crop to pixel crop for completedCrop
      const pixelCrop: PixelCrop = {
        unit: "px",
        x: (newCrop.x / 100) * width,
        y: (newCrop.y / 100) * height,
        width: (newCrop.width / 100) * width,
        height: (newCrop.height / 100) * height,
      };
      setCompletedCrop(pixelCrop);
    }
  }, []);

  const handleReset = useCallback(() => {
    const def = getDefaultAspectRatio(platform);
    setAspectRatio(def);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, def);
      setCrop(newCrop);
      // Convert percent crop to pixel crop for completedCrop
      const pixelCrop: PixelCrop = {
        unit: "px",
        x: (newCrop.x / 100) * width,
        y: (newCrop.y / 100) * height,
        width: (newCrop.width / 100) * width,
        height: (newCrop.height / 100) * height,
      };
      setCompletedCrop(pixelCrop);
    }
  }, [platform]);

  const platformNames: Record<SocialPlatform, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    x: "X / Twitter",
    threads: "Threads",
    tiktok: "TikTok",
  };

  return (
    // BACKDROP
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-[1300px] h-[85vh] bg-background border border-border shadow-2xl rounded-xl overflow-hidden flex flex-row">
        {/* LEFT SIDEBAR - CONTROLS */}
        <div className="w-[280px] md:w-[320px] flex flex-col border-r border-border bg-surface h-full shrink-0 z-10">
          {/* Header */}
          <div className="p-5 border-b border-border">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <CropIcon className="w-4 h-4" />
              Transform
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              For {platformNames[platform]}
            </p>
          </div>

          {/* Scrollable Controls */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Aspect Ratio Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Size Preset
                </label>
                <button
                  onClick={handleReset}
                  className="text-[11px] text-brand-primary hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {presets.map((preset) => {
                  // Calculate icon dimensions dynamically to preserve aspect ratio in the button
                  const isLandscape = preset.value >= 1;
                  const iconBaseSize = 18;
                  const iconWidth = isLandscape
                    ? iconBaseSize
                    : iconBaseSize * preset.value;
                  const iconHeight = isLandscape
                    ? iconBaseSize / preset.value
                    : iconBaseSize;

                  return (
                    <button
                      key={preset.label}
                      onClick={() => handleAspectChange(preset)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 border rounded-sm transition-all duration-200 group",
                        aspectRatio === preset.value
                          ? "border-foreground bg-background shadow-sm"
                          : "border-border bg-transparent hover:bg-surface-hover"
                      )}
                    >
                      {/* Dynamic Aspect Ratio Icon */}
                      <div className="flex items-center justify-center w-[20px] shrink-0">
                        <div
                          className={cn(
                            "border-2 rounded-[2px] transition-colors",
                            aspectRatio === preset.value
                              ? "border-foreground"
                              : "border-muted-foreground group-hover:border-foreground"
                          )}
                          style={{
                            width: `${iconWidth}px`,
                            height: `${iconHeight}px`,
                          }}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          aspectRatio === preset.value
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instruction Box */}
            <div className="rounded-sm border border-border bg-surface-hover p-3">
              <div className="flex gap-3">
                <Move className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Drag corners to resize. <br />
                  Drag inside to move.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-border bg-surface space-y-3">
            <Button onClick={handleSave} className="w-full" variant="primary">
              <Check className="mr-2 h-4 w-4" />
              Done
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-error text-error hover:bg-error/10 hover:text-error"
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* RIGHT AREA - CANVAS */}
        <div className="flex-1 relative bg-neutral-900 flex flex-col h-full overflow-hidden">
          {/* Top floating label */}

          <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-hidden">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="shadow-[0_0_60px_rgba(0,0,0,0.4)]"
              style={{ maxHeight: "100%" }}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-h-[calc(85vh-6rem)] max-w-full object-contain block"
                crossOrigin="anonymous"
              />
            </ReactCrop>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 p-2 text-white/60 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
