// components/post-editor/image-cropper-modal.tsx

"use client";

import { useState, useCallback, useRef } from "react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
  initialCrop,
  initialAspectRatio,
  onCropComplete,
}: ImageCropperModalProps) {
  const presets = PLATFORM_ASPECT_RATIOS[platform];
  const defaultAspect = initialAspectRatio ?? getDefaultAspectRatio(platform);

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(
    initialCrop ?? null
  );
  const [aspectRatio, setAspectRatio] = useState<number>(defaultAspect);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      // If we have an initial crop, convert it back to percentage for display
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
        // Create a centered crop with the default aspect ratio
        const newCrop = centerAspectCrop(width, height, aspectRatio);
        setCrop(newCrop);
      }
    },
    [initialCrop, aspectRatio]
  );

  const handleSave = useCallback(() => {
    if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0 && imgRef.current) {
      const { width, height } = imgRef.current;
      onCropComplete(completedCrop, aspectRatio, width, height);
      onClose();
    }
  }, [completedCrop, aspectRatio, onCropComplete, onClose]);

  const handleAspectChange = useCallback(
    (preset: AspectRatioPreset) => {
      setAspectRatio(preset.value);

      // Reset crop to center with new aspect ratio
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, preset.value);
        setCrop(newCrop);
      }
    },
    []
  );

  const platformNames: Record<SocialPlatform, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    x: "X / Twitter",
    threads: "Threads",
    tiktok: "TikTok",
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif">
            Crop Image for {platformNames[platform]}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          {/* Aspect Ratio Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant={aspectRatio === preset.value ? "primary" : "outline"}
                size="sm"
                onClick={() => handleAspectChange(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Drag the corners to resize the crop area
          </p>

          {/* Cropper Container */}
          <div className="relative w-full max-h-[400px] bg-black rounded-md overflow-hidden flex items-center justify-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="max-h-[400px]"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-h-[400px] max-w-full object-contain"
                crossOrigin="anonymous"
              />
            </ReactCrop>
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Apply Crop
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
