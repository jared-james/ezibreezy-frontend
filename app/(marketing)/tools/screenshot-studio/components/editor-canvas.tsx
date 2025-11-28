import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { BACKGROUND_OPTIONS, AspectRatio, TextLayer } from "../constants";

interface EditorCanvasProps {
  image: HTMLImageElement;
  padding: number;
  roundness: number;
  outerRoundness: number;
  shadow: number;
  shadowColor: string;
  reflection: number;
  windowChrome: boolean;
  showGlass: boolean;
  glassPlane: number;
  backgroundId: string;
  aspectRatio: AspectRatio;
  customColors: [string, string];
  useCustomGradient: boolean;
  textLayer: TextLayer;
  renderTextOnCanvas: boolean;
}

export const EditorCanvas = forwardRef((props: EditorCanvasProps, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const drawScene = (ctx: CanvasRenderingContext2D, includeText: boolean) => {
    const {
      image,
      padding,
      roundness,
      outerRoundness,
      shadow,
      shadowColor,
      reflection,
      windowChrome,
      showGlass,
      glassPlane,
      backgroundId,
      aspectRatio,
      customColors,
      useCustomGradient,
      textLayer,
    } = props;

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

    if (ctx.canvas.width !== finalWidth || ctx.canvas.height !== finalHeight) {
      ctx.canvas.width = finalWidth;
      ctx.canvas.height = finalHeight;
    }

    ctx.clearRect(0, 0, finalWidth, finalHeight);

    // 1. Draw Background
    ctx.save();
    const bgOption = BACKGROUND_OPTIONS.find((b) => b.id === backgroundId);
    let fillStyle: string | CanvasGradient;

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
        fillStyle = gradient;
      } else {
        fillStyle = customColors[0];
      }
    } else if (bgOption?.type === "gradient" && Array.isArray(bgOption.value)) {
      const gradient = ctx.createLinearGradient(0, 0, finalWidth, finalHeight);
      gradient.addColorStop(0, bgOption.value[0]);
      gradient.addColorStop(1, bgOption.value[1]);
      fillStyle = gradient;
    } else {
      fillStyle = (bgOption?.value as string) || "#ffffff";
    }

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

    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, finalWidth, finalHeight);
    ctx.restore();

    const drawX = (finalWidth - objectWidth) / 2;
    const drawY = (finalHeight - objectHeight) / 2;
    const r = roundness * (imgWidth / 800);

    // Helper: Draw Image Content (Reused for reflection)
    // Now accepts a specific context so we can draw to offscreen canvas
    const drawContent = (targetCtx: CanvasRenderingContext2D) => {
      if (windowChrome) {
        const objectPath = new Path2D();
        if (typeof targetCtx.roundRect === "function") {
          objectPath.roundRect(drawX, drawY, objectWidth, objectHeight, r);
        } else {
          objectPath.rect(drawX, drawY, objectWidth, objectHeight);
        }

        targetCtx.save();
        targetCtx.clip(objectPath);

        targetCtx.fillStyle = "#1e1e1e";
        targetCtx.fillRect(drawX, drawY, objectWidth, chromeHeight);

        const circleY = drawY + chromeHeight / 2;
        const startX = drawX + chromeHeight * 0.6;
        const gap = chromeHeight * 0.6;
        const radius = chromeHeight * 0.18;

        targetCtx.beginPath();
        targetCtx.arc(startX, circleY, radius, 0, 2 * Math.PI);
        targetCtx.fillStyle = "#FF5F56";
        targetCtx.fill();
        targetCtx.beginPath();
        targetCtx.arc(startX + gap, circleY, radius, 0, 2 * Math.PI);
        targetCtx.fillStyle = "#FFBD2E";
        targetCtx.fill();
        targetCtx.beginPath();
        targetCtx.arc(startX + gap * 2, circleY, radius, 0, 2 * Math.PI);
        targetCtx.fillStyle = "#27C93F";
        targetCtx.fill();

        targetCtx.drawImage(
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
        targetCtx.restore();
      } else {
        targetCtx.save();
        targetCtx.beginPath();
        if (typeof targetCtx.roundRect === "function") {
          targetCtx.roundRect(drawX, drawY, objectWidth, objectHeight, r);
        } else {
          targetCtx.rect(drawX, drawY, objectWidth, objectHeight);
        }
        targetCtx.clip();
        targetCtx.drawImage(
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
        targetCtx.restore();
      }
    };

    // 2. Draw Reflection (Fixed: Uses off-screen canvas to preserve background)
    if (reflection > 0) {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = finalWidth;
      offCanvas.height = finalHeight;
      const offCtx = offCanvas.getContext("2d");

      if (offCtx) {
        offCtx.save();

        const reflectionGap = 2;
        offCtx.translate(0, drawY + objectHeight + reflectionGap);
        offCtx.scale(1, -1);
        offCtx.translate(0, -drawY - objectHeight);

        // Draw image onto offscreen
        drawContent(offCtx);

        // Apply Mask
        offCtx.globalCompositeOperation = "destination-in";
        const gradient = offCtx.createLinearGradient(
          0,
          drawY + objectHeight,
          0,
          drawY
        );

        // Adjust opacity falloff based on slider
        const opacity = reflection / 100;
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.5})`);
        gradient.addColorStop(0.35, "rgba(255, 255, 255, 0)");

        offCtx.fillStyle = gradient;
        offCtx.fillRect(drawX, drawY, objectWidth, objectHeight);

        offCtx.restore();

        // Draw the finished reflection layer onto the main canvas
        ctx.drawImage(offCanvas, 0, 0);
      }
    }

    // 3. Draw Glass Effect
    if (showGlass) {
      ctx.save();
      const glassDist = glassPlane * (imgWidth / 1000);
      const glassX = drawX - glassDist;
      const glassY = drawY - glassDist;
      const glassW = objectWidth + glassDist * 2;
      const glassH = objectHeight + glassDist * 2;
      const glassR = r * 1.5;

      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(glassX, glassY, glassW, glassH, glassR);
      } else {
        ctx.rect(glassX, glassY, glassW, glassH);
      }

      ctx.save();
      ctx.clip();
      ctx.filter = "blur(20px)";
      ctx.scale(1.1, 1.1);
      ctx.translate(-finalWidth * 0.05, -finalHeight * 0.05);
      ctx.fillStyle = fillStyle;
      ctx.fillRect(0, 0, finalWidth, finalHeight);
      ctx.restore();

      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.stroke();

      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      ctx.fill();
      ctx.restore();
    }

    // 4. Draw Main Object Shadow
    if (shadow > 0) {
      ctx.save();
      ctx.shadowColor = hexToRgba(shadowColor, 0.6);
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

    // 5. Draw Main Content
    drawContent(ctx);

    // 6. Draw Text Overlay
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
      drawScene(ctx, true);
      const link = document.createElement("a");
      link.download = "ezibreezy-mockup.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      drawScene(ctx, false);
    },
    copy: async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
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
        drawScene(ctx, false);
      }
    },
    getDataUrl: () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      drawScene(ctx, true);
      const url = canvas.toDataURL("image/png");
      drawScene(ctx, false);
      return url;
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
