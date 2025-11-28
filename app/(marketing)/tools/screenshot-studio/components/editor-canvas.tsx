import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { BACKGROUND_OPTIONS } from "./editor-controls";
import { AspectRatio } from "../page";

interface EditorCanvasProps {
  image: HTMLImageElement;
  padding: number;
  roundness: number;
  outerRoundness: number;
  shadow: number;
  windowChrome: boolean;
  backgroundId: string;
  aspectRatio: AspectRatio;
  customColors: [string, string];
  useCustomGradient: boolean;
}

export const EditorCanvas = forwardRef((props: EditorCanvasProps, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    download: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "ezibreezy-mockup.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    },
    copy: async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        if (!blob) throw new Error("Failed to generate image blob");
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
      } catch (err) {
        console.error("Copy failed", err);
        throw err;
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !props.image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const {
      image,
      padding,
      roundness,
      outerRoundness,
      shadow,
      windowChrome,
      backgroundId,
      aspectRatio,
      customColors,
      useCustomGradient,
    } = props;

    // 1. Base Scale Logic (Retina Support)
    const MAX_WIDTH = 2400;
    let scale = 1;
    if (image.naturalWidth > MAX_WIDTH) {
      scale = MAX_WIDTH / image.naturalWidth;
    }
    const imgWidth = image.naturalWidth * scale;
    const imgHeight = image.naturalHeight * scale;

    // 2. Determine "Object" Dimensions (Chrome + Image)
    // Chrome bar is usually ~40px high relative to a 1000px image
    const chromeHeight = windowChrome
      ? 40 * scale * (imgWidth < 1000 ? 1000 / imgWidth : 1) * 0.8
      : 0;
    const objectWidth = imgWidth;
    const objectHeight = imgHeight + chromeHeight;

    // 3. Determine Padding
    const relativePadding = padding * (imgWidth / 800) * 1.5;

    // 4. Determine Min Canvas Size
    const minCanvasWidth = objectWidth + relativePadding * 2;
    const minCanvasHeight = objectHeight + relativePadding * 2;

    // 5. Determine Final Canvas Dimensions based on Aspect Ratio
    let finalWidth = minCanvasWidth;
    let finalHeight = minCanvasHeight;

    if (aspectRatio !== "auto") {
      let targetRatio = 1;
      switch (aspectRatio) {
        case "1:1":
          targetRatio = 1;
          break;
        case "4:5":
          targetRatio = 0.8;
          break;
        case "16:9":
          targetRatio = 16 / 9;
          break;
        case "1.91:1":
          targetRatio = 1.91;
          break;
        case "3:2":
          targetRatio = 1.5;
          break;
        case "4:3":
          targetRatio = 4 / 3;
          break;
        case "9:16":
          targetRatio = 9 / 16;
          break;
        default:
          targetRatio = 1;
      }

      const currentRatio = minCanvasWidth / minCanvasHeight;

      if (targetRatio > currentRatio) {
        finalHeight = minCanvasHeight;
        finalWidth = minCanvasHeight * targetRatio;
      } else {
        finalWidth = minCanvasWidth;
        finalHeight = minCanvasWidth / targetRatio;
      }
    }

    // Set Canvas Size
    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // Clear
    ctx.clearRect(0, 0, finalWidth, finalHeight);

    // 6. Draw Outer Clip (Background Radius)
    ctx.save();
    if (outerRoundness > 0) {
      const outerR = outerRoundness * (imgWidth / 800);
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(0, 0, finalWidth, finalHeight, outerR);
      } else {
        ctx.rect(0, 0, finalWidth, finalHeight);
      }
      ctx.clip();
    }

    // 7. Draw Background
    const bgOption = BACKGROUND_OPTIONS.find((b) => b.id === backgroundId);

    if (backgroundId === "custom") {
      if (useCustomGradient) {
        const gradient = ctx.createLinearGradient(
          0,
          0,
          finalWidth,
          finalHeight
        );
        gradient.addColorStop(0, customColors[0]);
        gradient.addColorStop(1, customColors[1]);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = customColors[0];
      }
      ctx.fillRect(0, 0, finalWidth, finalHeight);
    } else if (bgOption?.type === "gradient" && Array.isArray(bgOption.value)) {
      const gradient = ctx.createLinearGradient(0, 0, finalWidth, finalHeight);
      gradient.addColorStop(0, bgOption.value[0]);
      gradient.addColorStop(1, bgOption.value[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, finalWidth, finalHeight);
    } else {
      ctx.fillStyle = (bgOption?.value as string) || "#ffffff";
      ctx.fillRect(0, 0, finalWidth, finalHeight);
    }

    // 8. Calculate Position for Object (Centered)
    const drawX = (finalWidth - objectWidth) / 2;
    const drawY = (finalHeight - objectHeight) / 2;

    // Common Radius Scaled
    const r = roundness * (imgWidth / 800);

    // 9. Draw Shadow (Behind everything)
    if (shadow > 0) {
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = shadow * (imgWidth / 1000) * 2;
      ctx.shadowOffsetY = shadow * (imgWidth / 1000) * 0.8;
      ctx.fillStyle = "rgba(0,0,0,1)";

      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(drawX, drawY, objectWidth, objectHeight, r);
      } else {
        ctx.rect(drawX, drawY, objectWidth, objectHeight);
      }
      ctx.fill();
      ctx.restore();
    }

    // 10. Draw Window Chrome (If enabled)
    if (windowChrome) {
      ctx.save();

      // Draw Top Bar Background
      ctx.beginPath();
      // Top-Left and Top-Right corners rounded, Bottoms flat (unless image is short?)
      // Actually, we usually round the whole container, but splitting drawing is tricky.
      // Easier approach: Clip the whole area first, then draw inside.

      // Create Path for the whole object (Chrome + Image)
      const objectPath = new Path2D();
      if (typeof ctx.roundRect === "function") {
        objectPath.roundRect(drawX, drawY, objectWidth, objectHeight, r);
      } else {
        objectPath.rect(drawX, drawY, objectWidth, objectHeight);
      }

      ctx.clip(objectPath); // Clip everything to the rounded rectangle

      // Draw Chrome Bar Background
      ctx.fillStyle = "#1e1e1e"; // Mac Dark Grey
      ctx.fillRect(drawX, drawY, objectWidth, chromeHeight);

      // Draw Traffic Lights
      const circleY = drawY + chromeHeight / 2;
      const startX = drawX + chromeHeight * 0.6; // Padding left
      const gap = chromeHeight * 0.6;
      const radius = chromeHeight * 0.18;

      // Red
      ctx.beginPath();
      ctx.arc(startX, circleY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#FF5F56";
      ctx.fill();

      // Yellow
      ctx.beginPath();
      ctx.arc(startX + gap, circleY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFBD2E";
      ctx.fill();

      // Green
      ctx.beginPath();
      ctx.arc(startX + gap * 2, circleY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#27C93F";
      ctx.fill();

      // Draw Image Below Chrome
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        drawX,
        drawY + chromeHeight,
        objectWidth,
        objectHeight - chromeHeight
      );

      ctx.restore();
    } else {
      // No Chrome - Just draw Image with rounding
      ctx.save();
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(drawX, drawY, objectWidth, objectHeight, r);
      } else {
        ctx.rect(drawX, drawY, objectWidth, objectHeight);
      }
      ctx.clip();
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        drawX,
        drawY,
        objectWidth,
        objectHeight
      );
      ctx.restore();
    }

    ctx.restore(); // Restore Outer Clip
  }, [props]);

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full max-h-[60vh] object-contain border border-foreground/10 shadow-sm"
      style={{
        height: "auto",
        width: "auto",
      }}
    />
  );
});

EditorCanvas.displayName = "EditorCanvas";
