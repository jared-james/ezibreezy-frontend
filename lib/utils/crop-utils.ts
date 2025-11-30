// lib/utils/crop-utils.ts

import type { PixelCrop } from "react-image-crop";

export interface CropData {
  croppedAreaPixels: PixelCrop;
  aspectRatio: number;
}

export type PlatformCrops = {
  instagram?: CropData;
  facebook?: CropData;
  linkedin?: CropData;
  x?: CropData;
  threads?: CropData;
  tiktok?: CropData;
  youtube?: CropData;
};

export type SocialPlatform = keyof PlatformCrops;

export interface AspectRatioPreset {
  label: string;
  value: number;
}

export const STORY_ASPECT_RATIO = 9 / 16;

export const PLATFORM_ASPECT_RATIOS: Record<
  SocialPlatform,
  AspectRatioPreset[]
> = {
  instagram: [
    { label: "Square (1:1)", value: 1 },
    { label: "Portrait (4:5)", value: 4 / 5 },
    { label: "Landscape (1.91:1)", value: 1.91 },
    { label: "Story (9:16)", value: 9 / 16 },
  ],
  facebook: [
    { label: "Landscape (1.91:1)", value: 1.91 },
    { label: "Square (1:1)", value: 1 },
    { label: "Portrait (4:5)", value: 4 / 5 },
    { label: "Story (9:16)", value: 9 / 16 },
  ],
  linkedin: [
    { label: "Landscape (1.91:1)", value: 1.91 },
    { label: "Square (1:1)", value: 1 },
    { label: "Portrait (4:5)", value: 4 / 5 },
  ],
  x: [
    { label: "Landscape (16:9)", value: 16 / 9 },
    { label: "Square (1:1)", value: 1 },
  ],
  threads: [
    { label: "Square (1:1)", value: 1 },
    { label: "Portrait (4:5)", value: 4 / 5 },
    { label: "Landscape (1.91:1)", value: 1.91 },
  ],
  tiktok: [
    { label: "Full Screen (9:16)", value: 9 / 16 },
    { label: "Portrait (3:4)", value: 3 / 4 },
    { label: "Square (1:1)", value: 1 },
    { label: "Landscape (16:9)", value: 16 / 9 },
  ],
  youtube: [
    { label: "Landscape (16:9)", value: 16 / 9 },
    { label: "Square (1:1)", value: 1 },
    { label: "Shorts (9:16)", value: 9 / 16 },
  ],
};

export function getDefaultAspectRatio(platform: SocialPlatform): number {
  const presets = PLATFORM_ASPECT_RATIOS[platform];
  return presets[0]?.value ?? 1;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = url;
  });
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  displayedWidth?: number,
  displayedHeight?: number
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Calculate scale factor between displayed size and natural size
  const scaleX = displayedWidth ? image.naturalWidth / displayedWidth : 1;
  const scaleY = displayedHeight ? image.naturalHeight / displayedHeight : 1;

  // Scale the crop coordinates to match the actual image dimensions
  const scaledCrop = {
    x: pixelCrop.x * scaleX,
    y: pixelCrop.y * scaleY,
    width: pixelCrop.width * scaleX,
    height: pixelCrop.height * scaleY,
  };

  canvas.width = scaledCrop.width;
  canvas.height = scaledCrop.height;

  ctx.drawImage(
    image,
    scaledCrop.x,
    scaledCrop.y,
    scaledCrop.width,
    scaledCrop.height,
    0,
    0,
    scaledCrop.width,
    scaledCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas is empty"));
        }
      },
      "image/jpeg",
      0.95
    );
  });
}

export async function createCroppedPreviewUrl(
  imageSrc: string,
  pixelCrop: PixelCrop,
  displayedWidth?: number,
  displayedHeight?: number
): Promise<string> {
  const blob = await getCroppedImg(
    imageSrc,
    pixelCrop,
    displayedWidth,
    displayedHeight
  );
  return URL.createObjectURL(blob);
}

export async function createCroppedFile(
  imageSrc: string,
  pixelCrop: PixelCrop,
  originalFileName: string
): Promise<File> {
  const blob = await getCroppedImg(imageSrc, pixelCrop);
  const extension = originalFileName.split(".").pop() || "jpg";
  const baseName = originalFileName.replace(/\.[^/.]+$/, "");
  const newFileName = `${baseName}_cropped.${extension}`;
  return new File([blob], newFileName, { type: "image/jpeg" });
}

/**
 * Calculate a centered crop for a given aspect ratio.
 * Returns the crop coordinates in pixels relative to the displayed image dimensions.
 */
export function calculateCenteredCrop(
  imageWidth: number,
  imageHeight: number,
  targetAspectRatio: number
): PixelCrop {
  const imageAspectRatio = imageWidth / imageHeight;

  let cropWidth: number;
  let cropHeight: number;

  if (imageAspectRatio > targetAspectRatio) {
    // Image is wider than target - crop the sides
    cropHeight = imageHeight;
    cropWidth = imageHeight * targetAspectRatio;
  } else {
    // Image is taller than target - crop the top/bottom
    cropWidth = imageWidth;
    cropHeight = imageWidth / targetAspectRatio;
  }

  // Center the crop
  const x = (imageWidth - cropWidth) / 2;
  const y = (imageHeight - cropHeight) / 2;

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight),
    unit: "px",
  };
}

export async function applyCropsForPlatform(
  mediaItems: Array<{
    file: File | null;
    preview: string;
    crops?: PlatformCrops;
  }>,
  platform: SocialPlatform
): Promise<File[]> {
  const results: File[] = [];

  for (const item of mediaItems) {
    if (!item.file) continue;

    const cropData = item.crops?.[platform];
    if (cropData?.croppedAreaPixels) {
      try {
        const croppedFile = await createCroppedFile(
          item.preview,
          cropData.croppedAreaPixels,
          item.file.name
        );
        results.push(croppedFile);
      } catch (error) {
        console.error("Failed to apply crop, using original:", error);
        results.push(item.file);
      }
    } else {
      results.push(item.file);
    }
  }

  return results;
}
