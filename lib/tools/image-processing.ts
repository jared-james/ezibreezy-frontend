// lib/tools/image-processing.ts

export type SplitMode = "carousel" | "grid";
export type AspectRatio = "square" | "portrait" | "landscape" | "original";

interface ProcessOptions {
  file: File;
  mode: SplitMode;
  columns: number;
  rows: number;
  aspectRatio: AspectRatio;
  gap: number;
  gapColor?: string;
}

export async function processAndDownload({
  file,
  mode,
  columns,
  rows,
  aspectRatio,
  gap,
  gapColor = "#FFFFFF",
}: ProcessOptions) {
  // Dynamically import heavy libraries only when download is triggered
  const [JSZip, { saveAs }] = await Promise.all([
    import("jszip"),
    import("file-saver"),
  ]);

  const image = await loadImage(file);
  const zip = new JSZip.default();
  const folder = zip.folder("split-images");

  if (mode === "carousel") {
    await processCarousel(image, folder!, columns, aspectRatio, gap, gapColor);
  } else {
    await processGrid(image, folder!, columns, rows, gap, gapColor);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `ezibreezy-${mode}-${Date.now()}.zip`);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function processCarousel(
  img: HTMLImageElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  folder: any,
  slides: number,
  ratioType: AspectRatio,
  marginPercent: number,
  gapColor: string
) {
  let targetHeight = img.height;
  let targetWidth = img.width;

  if (ratioType !== "original") {
    const slideRatio =
      ratioType === "portrait" ? 4 / 5 : ratioType === "landscape" ? 1.91 : 1;
    const totalRatio = slideRatio * slides;

    if (img.width / img.height > totalRatio) {
      targetWidth = img.height * totalRatio;
    } else {
      targetHeight = img.width / totalRatio;
    }
  }

  const startX = (img.width - targetWidth) / 2;
  const startY = (img.height - targetHeight) / 2;
  const slideWidth = targetWidth / slides;

  for (let i = 0; i < slides; i++) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = slideWidth;
    canvas.height = targetHeight;

    // Fill background for safe zones with selected gap color
    ctx.fillStyle = gapColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sourceX = startX + i * slideWidth;

    // Apply Safe Zone Margin
    // The margin reduces the drawn image size and centers it
    const marginPxX = (slideWidth * marginPercent) / 100;
    const marginPxY = (targetHeight * marginPercent) / 100;

    const drawWidth = slideWidth - marginPxX * 2;
    const drawHeight = targetHeight - marginPxY * 2;

    ctx.drawImage(
      img,
      sourceX,
      startY,
      slideWidth,
      targetHeight,
      marginPxX,
      marginPxY,
      drawWidth,
      drawHeight
    );

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95)
    );
    folder.file(`slide-${i + 1}.jpg`, blob);
  }
}

async function processGrid(
  img: HTMLImageElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  folder: any,
  cols: number,
  rows: number,
  gapPercent: number,
  _gapColor: string // Not currently used for grid mode, but kept for API consistency
) {
  // Gap Compensation Logic
  // We calculate the gap in pixels relative to the image size
  // and effectively "skip" those pixels when slicing to create continuity

  // Total logic width is the image width
  // We need to divide the image into (cols) parts + (cols-1) gaps
  // gapPercent is passed as 0-10. Let's treat it as percentage of a cell width.

  const gapFactor = gapPercent / 100; // e.g. 0.05

  // Calculate the width of one visible cell unit
  // Total Width = (cols * cellWidth) + ((cols - 1) * (cellWidth * gapFactor))
  const totalUnitsX = cols + (cols - 1) * gapFactor;
  const cellWidth = img.width / totalUnitsX;
  const gapPxX = cellWidth * gapFactor;

  // Same for height
  const totalUnitsY = rows + (rows - 1) * gapFactor;
  const cellHeight = img.height / totalUnitsY;
  const gapPxY = cellHeight * gapFactor;

  let count = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = cellWidth;
      canvas.height = cellHeight;

      const sourceX = c * (cellWidth + gapPxX);
      const sourceY = r * (cellHeight + gapPxY);

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        cellWidth,
        cellHeight,
        0,
        0,
        cellWidth,
        cellHeight
      );

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95)
      );
      folder.file(`tile-${count}.jpg`, blob);
      count++;
    }
  }
}
