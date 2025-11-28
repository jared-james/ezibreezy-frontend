import JSZip from "jszip";
import { saveAs } from "file-saver";

export type SplitMode = "carousel" | "grid";
export type AspectRatio = "square" | "portrait" | "landscape" | "original";

interface SplitConfig {
  mode: SplitMode;
  columns: number;
  rows: number; // Only used for grid mode
  aspectRatio: AspectRatio;
  file: File;
}

export async function processAndDownload(config: SplitConfig): Promise<void> {
  const { file, mode, columns, rows, aspectRatio } = config;

  const imageBitmap = await createImageBitmap(file);
  const srcWidth = imageBitmap.width;
  const srcHeight = imageBitmap.height;

  // 1. Calculate Crop Dimensions based on Mode
  let cropX = 0;
  let cropY = 0;
  let cropWidth = srcWidth;
  let cropHeight = srcHeight;
  let singleSlideWidth = 0;
  let singleSlideHeight = 0;

  if (mode === "carousel") {
    // CAROUSEL LOGIC:
    // We want N columns.
    // The height is determined by the chosen Aspect Ratio relative to a single slice.
    // Standard Instagram Portrait is 4:5 (0.8). Square is 1:1 (1.0).

    let targetSlideRatio = 0; // width / height

    switch (aspectRatio) {
      case "portrait":
        targetSlideRatio = 4 / 5; // 0.8
        break;
      case "square":
        targetSlideRatio = 1 / 1; // 1.0
        break;
      case "landscape":
        targetSlideRatio = 1.91 / 1; // 1.91
        break;
      case "original":
      default:
        // Use the natural aspect ratio of a single slice based on the full image width
        targetSlideRatio = srcWidth / columns / srcHeight;
        break;
    }

    // The aspect ratio of the WHOLE strip should be targetSlideRatio * columns
    const targetTotalRatio = targetSlideRatio * columns;
    const currentTotalRatio = srcWidth / srcHeight;

    if (aspectRatio !== "original") {
      if (currentTotalRatio > targetTotalRatio) {
        // Image is wider than needed. Crop width.
        cropHeight = srcHeight;
        cropWidth = srcHeight * targetTotalRatio;
        cropX = (srcWidth - cropWidth) / 2;
        cropY = 0;
      } else {
        // Image is taller than needed. Crop height.
        cropWidth = srcWidth;
        cropHeight = srcWidth / targetTotalRatio;
        cropX = 0;
        cropY = (srcHeight - cropHeight) / 2;
      }
    }

    singleSlideWidth = cropWidth / columns;
    singleSlideHeight = cropHeight; // 1 row
  } else {
    // GRID LOGIC:
    // Simply split the image into C x R.
    // Usually we want the result to be square per tile for Profile Grids,
    // but standard grid splitters just divide the image mathematically.

    // However, if the user wants "Square Grid" tiles specifically (standard Instagram profile),
    // we should crop the source image to match the target aspect ratio of (Cols/Rows).

    // For this implementation, we will assume "Grid" acts like a cookie cutter
    // that uses the maximum area possible while maintaining equal cell sizes.
    // Or, simpler: We split the current image exactly as is.

    singleSlideWidth = srcWidth / columns;
    singleSlideHeight = srcHeight / rows;

    // Grid logic uses full image dimensions
    cropWidth = srcWidth;
    cropHeight = srcHeight;
  }

  // 2. Processing
  const zip = new JSZip();
  const folder = zip.folder("split-images");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  // Determine final loop counts
  const loopRows = mode === "carousel" ? 1 : rows;
  const loopCols = columns;

  canvas.width = singleSlideWidth;
  canvas.height = singleSlideHeight;

  const promises: Promise<void>[] = [];

  for (let r = 0; r < loopRows; r++) {
    for (let c = 0; c < loopCols; c++) {
      promises.push(
        new Promise<void>((resolve) => {
          // Clear canvas for new tile
          ctx.clearRect(0, 0, singleSlideWidth, singleSlideHeight);

          // Calculate where to grab from source
          const sx = cropX + c * singleSlideWidth;
          const sy = cropY + r * singleSlideHeight;

          ctx.drawImage(
            imageBitmap,
            sx,
            sy,
            singleSlideWidth,
            singleSlideHeight, // Source
            0,
            0,
            singleSlideWidth,
            singleSlideHeight // Destination
          );

          // Naming convention:
          // Carousel: slide-1, slide-2...
          // Grid: Sometimes users want reverse order (bottom right to top left) for IG uploading
          // We will stick to standard reading order: row1-col1, row1-col2...
          // Let's use a simple counter index
          const index = r * loopCols + c + 1;

          canvas.toBlob(
            (blob) => {
              if (blob && folder) {
                folder.file(`split-${index}.jpg`, blob);
              }
              resolve();
            },
            "image/jpeg",
            0.95
          );
        })
      );
    }
  }

  await Promise.all(promises);

  // 3. Download
  const content = await zip.generateAsync({ type: "blob" });
  const filename =
    mode === "carousel"
      ? `carousel-${columns}-slides-${Date.now()}.zip`
      : `grid-${columns}x${rows}-${Date.now()}.zip`;

  saveAs(content, filename);
}
