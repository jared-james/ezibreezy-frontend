// app/(marketing)/tools/social-image-resizer/components/crop-canvas.tsx

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { SocialFormat } from "../constants";
import { Layer } from "../client";

interface CropCanvasProps {
  layers: Layer[];
  activeLayerId: string | null;
  format: SocialFormat;
  backgroundColor: string;
  onSelectLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<Layer["settings"]>) => void;
}

export interface CropCanvasRef {
  download: () => void;
}

interface Point {
  x: number;
  y: number;
}

type InteractionMode = "IDLE" | "DRAGGING" | "SCALING";

export const CropCanvas = forwardRef<CropCanvasRef, CropCanvasProps>(
  (props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [mode, setMode] = useState<InteractionMode>("IDLE");
    const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
    const [hoverLayerId, setHoverLayerId] = useState<string | null>(null);

    const [originalLayerPos, setOriginalLayerPos] = useState<Point>({
      x: 0,
      y: 0,
    });

    const [activeHandle, setActiveHandle] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      download: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const exportCanvas = document.createElement("canvas");
        const ctx = exportCanvas.getContext("2d");
        if (!ctx) return;

        exportCanvas.width = props.format.width;
        exportCanvas.height = props.format.height;

        // Background Color
        ctx.fillStyle = props.backgroundColor;
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        // Prep transforms
        const previewCanvas = canvasRef.current;
        const scaleFactorX = previewCanvas
          ? exportCanvas.width / previewCanvas.width
          : 1;
        const scaleFactorY = previewCanvas
          ? exportCanvas.height / previewCanvas.height
          : 1;

        const centerX = exportCanvas.width / 2;
        const centerY = exportCanvas.height / 2;

        props.layers.forEach((layer) => {
          ctx.save();

          // Unified Scaling: Zoom 1 = 50% of canvas width
          const baseScale =
            (exportCanvas.width * 0.5) / layer.image.naturalWidth;
          const finalScale = baseScale * layer.settings.zoom;

          const dx = layer.settings.x * scaleFactorX;
          const dy = layer.settings.y * scaleFactorY;

          ctx.translate(centerX + dx, centerY + dy);
          ctx.rotate((layer.settings.rotation * Math.PI) / 180);
          ctx.scale(finalScale, finalScale);
          ctx.drawImage(
            layer.image,
            -layer.image.naturalWidth / 2,
            -layer.image.naturalHeight / 2
          );

          ctx.restore();
        });

        // Note: We export as a Square/Rectangle even for Profile Pics,
        // because platforms expect the full image and apply their own rounding.
        const link = document.createElement("a");
        const filename = `ezibreezy-${props.format.id}-${Date.now()}.png`;
        link.download = filename;
        link.href = exportCanvas.toDataURL("image/png", 1.0);
        link.click();
      },
    }));

    // --- Math Helpers ---

    const getCropRect = () => {
      if (!containerRef.current) return { x: 0, y: 0, w: 0, h: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 40;
      const availableW = rect.width - padding * 2;
      const availableH = rect.height - padding * 2;
      const formatRatio = props.format.aspectRatio;
      const viewRatio = availableW / availableH;
      let cropW, cropH;
      if (formatRatio > viewRatio) {
        cropW = availableW;
        cropH = availableW / formatRatio;
      } else {
        cropH = availableH;
        cropW = availableH * formatRatio;
      }
      const cropX = (rect.width - cropW) / 2;
      const cropY = (rect.height - cropH) / 2;
      return { x: cropX, y: cropY, w: cropW, h: cropH };
    };

    const getLayerTransform = (
      layer: Layer,
      cropRect: { w: number; h: number }
    ) => {
      const baseScale = (cropRect.w * 0.5) / layer.image.naturalWidth;
      const finalScale = baseScale * layer.settings.zoom;
      const width = layer.image.naturalWidth * finalScale;
      const height = layer.image.naturalHeight * finalScale;
      return { width, height };
    };

    const toLocalSpace = (
      px: number,
      py: number,
      layer: Layer,
      cropRect: any
    ) => {
      const centerX = cropRect.x + cropRect.w / 2 + layer.settings.x;
      const centerY = cropRect.y + cropRect.h / 2 + layer.settings.y;

      const dx = px - centerX;
      const dy = py - centerY;

      const rad = -layer.settings.rotation * (Math.PI / 180);
      const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localY = dx * Math.sin(rad) + dy * Math.cos(rad);
      return { x: localX, y: localY };
    };

    // --- Draw Loop ---
    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cropRect = getCropRect();

      // Viewport BG
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Clip to Crop Area
      ctx.save();
      ctx.beginPath();

      // If round, create circular clipping path for the "Active Area" visualization
      // Note: We don't clip the *drawing* of layers to circle, just the background color fill
      // to mimic the canvas shape.
      if (props.format.round) {
        ctx.arc(
          cropRect.x + cropRect.w / 2,
          cropRect.y + cropRect.h / 2,
          cropRect.w / 2,
          0,
          2 * Math.PI
        );
      } else {
        ctx.rect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
      }
      ctx.clip();

      // User BG Color
      ctx.fillStyle = props.backgroundColor;
      ctx.fillRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);

      const centerX = cropRect.x + cropRect.w / 2;
      const centerY = cropRect.y + cropRect.h / 2;

      // Render Layers
      props.layers.forEach((layer) => {
        ctx.save();

        const baseScale = (cropRect.w * 0.5) / layer.image.naturalWidth;
        const finalScale = baseScale * layer.settings.zoom;

        ctx.translate(centerX + layer.settings.x, centerY + layer.settings.y);
        ctx.rotate((layer.settings.rotation * Math.PI) / 180);
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(
          layer.image,
          -layer.image.naturalWidth / 2,
          -layer.image.naturalHeight / 2
        );

        ctx.restore();

        // 1. Hover Outline (Red)
        if (layer.id === hoverLayerId && layer.id !== props.activeLayerId) {
          ctx.save();
          ctx.translate(centerX + layer.settings.x, centerY + layer.settings.y);
          ctx.rotate((layer.settings.rotation * Math.PI) / 180);
          const w = layer.image.naturalWidth * finalScale;
          const h = layer.image.naturalHeight * finalScale;
          ctx.scale(1 / finalScale, 1 / finalScale);

          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(-w / 2, -h / 2, w, h);
          ctx.restore();
        }

        // 2. Active Selection UI (Blue)
        if (props.activeLayerId === layer.id) {
          ctx.save();
          ctx.translate(centerX + layer.settings.x, centerY + layer.settings.y);
          ctx.rotate((layer.settings.rotation * Math.PI) / 180);

          const w = layer.image.naturalWidth * finalScale;
          const h = layer.image.naturalHeight * finalScale;

          ctx.scale(1 / finalScale, 1 / finalScale);

          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 2;
          ctx.strokeRect(-w / 2, -h / 2, w, h);

          // Corner handles
          ctx.fillStyle = "#3b82f6";
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          const handleSize = 10;

          const corners = [
            { x: -w / 2, y: -h / 2 },
            { x: w / 2, y: -h / 2 },
            { x: w / 2, y: h / 2 },
            { x: -w / 2, y: h / 2 },
          ];

          corners.forEach((c) => {
            ctx.beginPath();
            ctx.rect(
              c.x - handleSize / 2,
              c.y - handleSize / 2,
              handleSize,
              handleSize
            );
            ctx.fill();
            ctx.stroke();
          });

          ctx.restore();
        }
      });

      ctx.restore();

      // Crop Guide Border (White Line)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1;

      if (props.format.round) {
        ctx.arc(
          cropRect.x + cropRect.w / 2,
          cropRect.y + cropRect.h / 2,
          cropRect.w / 2,
          0,
          2 * Math.PI
        );
      } else {
        ctx.rect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
      }
      ctx.stroke();

      // Mask (Dark Overlay outside crop)
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath();
      ctx.rect(0, 0, rect.width, rect.height); // Outer full rect

      if (props.format.round) {
        // Cut out circle
        ctx.arc(
          cropRect.x + cropRect.w / 2,
          cropRect.y + cropRect.h / 2,
          cropRect.w / 2,
          0,
          2 * Math.PI,
          true // Counter-clockwise to cut hole in fill
        );
      } else {
        // Cut out rect
        ctx.rect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
      }

      ctx.fill("evenodd");
    }, [
      props.layers,
      props.activeLayerId,
      props.format,
      props.backgroundColor,
      hoverLayerId,
    ]);

    // --- Interaction Handlers ---

    const handleMouseDown = (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const cropRect = getCropRect();

      // 1. Check Active Layer Handles first
      if (props.activeLayerId) {
        const layer = props.layers.find((l) => l.id === props.activeLayerId);
        if (layer) {
          const local = toLocalSpace(mouseX, mouseY, layer, cropRect);
          const { width, height } = getLayerTransform(layer, cropRect);
          const handleSize = 15;

          const corners = [
            { id: "tl", x: -width / 2, y: -height / 2 },
            { id: "tr", x: width / 2, y: -height / 2 },
            { id: "br", x: width / 2, y: height / 2 },
            { id: "bl", x: -width / 2, y: height / 2 },
          ];

          for (const c of corners) {
            if (
              Math.abs(local.x - c.x) < handleSize &&
              Math.abs(local.y - c.y) < handleSize
            ) {
              setMode("SCALING");
              setActiveHandle(c.id);
              setStartPoint({ x: e.clientX, y: e.clientY });
              return;
            }
          }
        }
      }

      // 2. Check Hit on Layer Body
      let clickedLayerId: string | null = null;
      for (let i = props.layers.length - 1; i >= 0; i--) {
        const layer = props.layers[i];
        const local = toLocalSpace(mouseX, mouseY, layer, cropRect);
        const { width, height } = getLayerTransform(layer, cropRect);

        if (Math.abs(local.x) < width / 2 && Math.abs(local.y) < height / 2) {
          clickedLayerId = layer.id;
          break;
        }
      }

      if (clickedLayerId) {
        props.onSelectLayer(clickedLayerId);
        setMode("DRAGGING");
        setStartPoint({ x: e.clientX, y: e.clientY });

        const layer = props.layers.find((l) => l.id === clickedLayerId);
        if (layer) {
          setOriginalLayerPos({ x: layer.settings.x, y: layer.settings.y });
        }
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const cropRect = getCropRect();

      // Mode: Hit Testing (Hover Effect)
      if (mode === "IDLE") {
        let foundHoverId: string | null = null;
        for (let i = props.layers.length - 1; i >= 0; i--) {
          const layer = props.layers[i];
          const local = toLocalSpace(mouseX, mouseY, layer, cropRect);
          const { width, height } = getLayerTransform(layer, cropRect);

          if (Math.abs(local.x) < width / 2 && Math.abs(local.y) < height / 2) {
            foundHoverId = layer.id;
            break;
          }
        }
        if (foundHoverId !== hoverLayerId) {
          setHoverLayerId(foundHoverId);
        }
      }

      if (mode === "IDLE" || !props.activeLayerId) return;

      const layer = props.layers.find((l) => l.id === props.activeLayerId);
      if (!layer) return;

      if (mode === "DRAGGING") {
        const deltaX = e.clientX - startPoint.x;
        const deltaY = e.clientY - startPoint.y;

        props.onUpdateLayer(layer.id, {
          x: originalLayerPos.x + deltaX,
          y: originalLayerPos.y + deltaY,
        });
      } else if (mode === "SCALING") {
        const centerX = cropRect.x + cropRect.w / 2 + layer.settings.x;
        const centerY = cropRect.y + cropRect.h / 2 + layer.settings.y;

        const dist = Math.sqrt(
          Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
        );

        const baseScale = (cropRect.w * 0.5) / layer.image.naturalWidth;
        const naturalHalfDiag =
          (Math.sqrt(
            Math.pow(layer.image.naturalWidth, 2) +
              Math.pow(layer.image.naturalHeight, 2)
          ) /
            2) *
          baseScale;

        const newZoom = dist / naturalHalfDiag;
        const safeZoom = Math.max(0.1, Math.min(5, newZoom));

        props.onUpdateLayer(layer.id, { zoom: safeZoom });
      }
    };

    const handleMouseUp = () => {
      setMode("IDLE");
      setActiveHandle(null);
    };

    const getCursorStyle = () => {
      if (mode === "DRAGGING") return "grabbing";
      if (mode === "SCALING") return "nwse-resize";
      if (hoverLayerId && mode === "IDLE") return "pointer";
      return "default";
    };

    return (
      <div
        ref={containerRef}
        className="w-full h-full relative overflow-hidden bg-[#1a1a1a] select-none"
        style={{ cursor: getCursorStyle() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setHoverLayerId(null);
        }}
      >
        <canvas ref={canvasRef} className="block" />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-50 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
          <span className="text-[10px] text-white font-mono uppercase tracking-widest">
            {mode === "SCALING"
              ? "Scaling..."
              : mode === "DRAGGING"
              ? "Moving..."
              : props.activeLayerId
              ? "Drag to Move • Corners to Scale"
              : "Click Image to Select"}
          </span>
        </div>
      </div>
    );
  }
);

CropCanvas.displayName = "CropCanvas";
