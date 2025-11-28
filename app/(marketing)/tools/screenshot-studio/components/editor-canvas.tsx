// app/(marketing)/tools/screenshot-studio/components/editor-canvas.tsx

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { BACKGROUND_OPTIONS, AspectRatio, TextLayer } from "../constants";

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
  textLayer: TextLayer;
  renderTextOnCanvas: boolean; // Control flag
}

export const EditorCanvas = forwardRef((props: EditorCanvasProps, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper function to draw the scene
  const drawScene = (ctx: CanvasRenderingContext2D, includeText: boolean) => {
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
      textLayer,
    } = props;

    // 1. Base Scale Logic
    const MAX_WIDTH = 2400;
    let scale = 1;
    if (image.naturalWidth > MAX_WIDTH) {
      scale = MAX_WIDTH / image.naturalWidth;
    }
    const imgWidth = image.naturalWidth * scale;
    const imgHeight = image.naturalHeight * scale;

    const chromeHeight = windowChrome
      ? 40 * scale * (imgWidth < 1000 ? 1000 / imgWidth : 1) * 0.8
      : 0;
    const objectWidth = imgWidth;
    const objectHeight = imgHeight + chromeHeight;

    const relativePadding = padding * (imgWidth / 800) * 1.5;

    const minCanvasWidth = objectWidth + relativePadding * 2;
    const minCanvasHeight = objectHeight + relativePadding * 2;

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

    // Set size
    if (ctx.canvas.width !== finalWidth || ctx.canvas.height !== finalHeight) {
      ctx.canvas.width = finalWidth;
      ctx.canvas.height = finalHeight;
    }

    // --- DRAWING ---
    ctx.clearRect(0, 0, finalWidth, finalHeight);
    ctx.save();

    // Background
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
    } else if (bgOption?.type === "gradient" && Array.isArray(bgOption.value)) {
      const gradient = ctx.createLinearGradient(0, 0, finalWidth, finalHeight);
      gradient.addColorStop(0, bgOption.value[0]);
      gradient.addColorStop(1, bgOption.value[1]);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = (bgOption?.value as string) || "#ffffff";
    }
    ctx.fillRect(0, 0, finalWidth, finalHeight);

    // Outer Clip
    if (outerRoundness > 0) {
      const r = outerRoundness * (imgWidth / 800);
      const maxR = Math.min(finalWidth, finalHeight) / 2;
      const radius = Math.min(r, maxR);
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.arcTo(finalWidth, 0, finalWidth, finalHeight, radius);
      ctx.arcTo(finalWidth, finalHeight, 0, finalHeight, radius);
      ctx.arcTo(0, finalHeight, 0, 0, radius);
      ctx.arcTo(0, 0, finalWidth, 0, radius);
      ctx.closePath();
      ctx.clip();
    }

    const drawX = (finalWidth - objectWidth) / 2;
    const drawY = (finalHeight - objectHeight) / 2;
    const r = roundness * (imgWidth / 800);

    // Shadow
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

    // Window / Image
    if (windowChrome) {
      ctx.save();
      const objectPath = new Path2D();
      if (typeof ctx.roundRect === "function") {
        objectPath.roundRect(drawX, drawY, objectWidth, objectHeight, r);
      } else {
        objectPath.rect(drawX, drawY, objectWidth, objectHeight);
      }
      ctx.clip(objectPath);

      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(drawX, drawY, objectWidth, chromeHeight);

      const circleY = drawY + chromeHeight / 2;
      const startX = drawX + chromeHeight * 0.6;
      const gap = chromeHeight * 0.6;
      const radius = chromeHeight * 0.18;

      ctx.beginPath();
      ctx.arc(startX, circleY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#FF5F56";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(startX + gap, circleY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFBD2E";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(startX + gap * 2, circleY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#27C93F";
      ctx.fill();

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
    ctx.restore();

    // Text Overlay
    if (includeText && textLayer.text) {
      ctx.save();
      const scaledFontSize = textLayer.fontSize * (imgWidth / 1000);
      ctx.font = `bold ${scaledFontSize}px ${textLayer.fontFamily}`;
      ctx.fillStyle = textLayer.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      const textX = finalWidth * (textLayer.x / 100);
      const textY = finalHeight * (textLayer.y / 100);

      ctx.fillText(textLayer.text, textX, textY);
      ctx.restore();
    }
  };

  useImperativeHandle(ref, () => ({
    download: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Force redraw WITH text
      drawScene(ctx, true);

      // 2. Download
      const link = document.createElement("a");
      link.download = "ezibreezy-mockup.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      // 3. Force redraw WITHOUT text (return to preview state)
      drawScene(ctx, false);
    },
    copy: async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Force redraw WITH text
      drawScene(ctx, true);

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
      } finally {
        // 2. Force redraw WITHOUT text
        drawScene(ctx, false);
      }
    },
    getCanvasWidth: () => {
      const canvas = canvasRef.current;
      if (!canvas) return 1000;
      return canvas.width;
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !props.image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Standard render loop (respects props.renderTextOnCanvas, which defaults to false)
    drawScene(ctx, props.renderTextOnCanvas);
  }, [props]);

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full max-h-[60vh] object-contain"
      style={{
        height: "auto",
        width: "auto",
      }}
    />
  );
});

EditorCanvas.displayName = "EditorCanvas";
