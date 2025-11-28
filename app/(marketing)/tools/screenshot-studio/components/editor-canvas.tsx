import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { BACKGROUND_OPTIONS } from "./editor-controls";
import { AspectRatio } from "../page";

interface EditorCanvasProps {
  image: HTMLImageElement;
  padding: number;
  roundness: number;
  outerRoundness: number;
  shadow: number;
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
      backgroundId,
      aspectRatio,
      customColors,
      useCustomGradient,
    } = props;

    // 1. Base Scale Logic
    const MAX_WIDTH = 2400;
    let scale = 1;
    if (image.naturalWidth > MAX_WIDTH) {
      scale = MAX_WIDTH / image.naturalWidth;
    }
    const imgWidth = image.naturalWidth * scale;
    const imgHeight = image.naturalHeight * scale;

    // 2. Determine Inner Box (Image + Padding)
    const relativePadding = padding * (imgWidth / 800) * 1.5;
    const minCanvasWidth = imgWidth + relativePadding * 2;
    const minCanvasHeight = imgHeight + relativePadding * 2;

    // 3. Determine Final Canvas Dimensions based on Aspect Ratio
    let finalWidth = minCanvasWidth;
    let finalHeight = minCanvasHeight;

    if (aspectRatio !== "auto") {
      let targetRatio = 1;
      if (aspectRatio === "1:1") targetRatio = 1;
      if (aspectRatio === "4:5") targetRatio = 4 / 5;
      if (aspectRatio === "16:9") targetRatio = 16 / 9;
      if (aspectRatio === "9:16") targetRatio = 9 / 16;

      const currentRatio = minCanvasWidth / minCanvasHeight;

      if (targetRatio > currentRatio) {
        finalHeight = minCanvasHeight;
        finalWidth = minCanvasHeight * targetRatio;
      } else {
        finalWidth = minCanvasWidth;
        finalHeight = minCanvasWidth / targetRatio;
      }
    }

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // Clear canvas first (important for transparency)
    ctx.clearRect(0, 0, finalWidth, finalHeight);

    // 4. Clip Canvas for Outer Roundness
    ctx.save();

    // Logic for outer radius clipping
    if (outerRoundness > 0) {
      // We scale the outer roundness logic similar to inner
      // Using same reference base (imgWidth / 800)
      const outerR = outerRoundness * (imgWidth / 800);

      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(0, 0, finalWidth, finalHeight, outerR);
      } else {
        ctx.rect(0, 0, finalWidth, finalHeight); // fallback
      }
      ctx.clip();
    }

    // 5. Draw Background
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
      // Fallback or Solid
      ctx.fillStyle = (bgOption?.value as string) || "#ffffff";
      ctx.fillRect(0, 0, finalWidth, finalHeight);
    }

    // 6. Calculate Center Position for Image
    const drawX = (finalWidth - imgWidth) / 2;
    const drawY = (finalHeight - imgHeight) / 2;

    // 7. Draw Shadow
    if (shadow > 0) {
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = shadow * (imgWidth / 1000) * 2;
      ctx.shadowOffsetY = shadow * (imgWidth / 1000) * 0.8;
      ctx.fillStyle = "rgba(0,0,0,1)";

      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        const r = roundness * (imgWidth / 800);
        ctx.roundRect(drawX, drawY, imgWidth, imgHeight, r);
      } else {
        ctx.rect(drawX, drawY, imgWidth, imgHeight);
      }
      ctx.fill();
      ctx.restore();
    }

    // 8. Draw Image
    ctx.save();
    const radius = roundness * (imgWidth / 800);

    if (radius > 0) {
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(drawX, drawY, imgWidth, imgHeight, radius);
      } else {
        ctx.rect(drawX, drawY, imgWidth, imgHeight);
      }
      ctx.clip();
    }

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      drawX,
      drawY,
      imgWidth,
      imgHeight
    );
    ctx.restore();

    // Restore the Outer Clip context
    ctx.restore();
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
