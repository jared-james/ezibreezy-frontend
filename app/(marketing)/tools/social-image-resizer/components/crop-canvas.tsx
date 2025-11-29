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
  onUpdatePosition: (id: string, x: number, y: number) => void;
}

export interface CropCanvasRef {
  download: () => void;
}

interface Point {
  x: number;
  y: number;
}

export const CropCanvas = forwardRef<CropCanvasRef, CropCanvasProps>(
  (props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
    const [originalLayerPos, setOriginalLayerPos] = useState<Point>({
      x: 0,
      y: 0,
    });

    useImperativeHandle(ref, () => ({
      download: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // High res export canvas
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

        // Use average scale factor (usually they are same)
        // We need to relate the "crop window" pixels to "export canvas" pixels.
        // Actually, we can just re-calculate layout logic based on the export dimensions.
        const centerX = exportCanvas.width / 2;
        const centerY = exportCanvas.height / 2;

        props.layers.forEach((layer) => {
          ctx.save();

          let baseScale;
          if (layer.type === "background") {
            const scaleW = exportCanvas.width / layer.image.naturalWidth;
            const scaleH = exportCanvas.height / layer.image.naturalHeight;
            baseScale = Math.max(scaleW, scaleH);
          } else {
            // Overlays scaled relative to canvas width
            baseScale = (exportCanvas.width * 0.5) / layer.image.naturalWidth;
          }

          const finalScale = baseScale * layer.settings.zoom;

          // The stored X/Y are in "Screen/Preview Pixels".
          // We need to scale the offset to match the export resolution.
          // IMPORTANT: We need to know the ratio between Preview Crop Width and Export Width.
          // It's cleaner to just assume the offset is proportional, but for now let's reuse the ratio derived from canvas sizes.

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

        const link = document.createElement("a");
        const filename = `ezibreezy-${props.format.id}-${Date.now()}.png`;
        link.download = filename;
        link.href = exportCanvas.toDataURL("image/png", 1.0);
        link.click();
      },
    }));

    // --- Helper: Point in Rotated Rectangle Detection ---
    const isPointInLayer = (
      px: number,
      py: number,
      layer: Layer,
      cropRect: { x: number; y: number; w: number; h: number }
    ) => {
      // Center of the layer in canvas space
      const centerX = cropRect.x + cropRect.w / 2 + layer.settings.x;
      const centerY = cropRect.y + cropRect.h / 2 + layer.settings.y;

      // Calculate dimensions
      let baseScale;
      if (layer.type === "background") {
        const scaleW = cropRect.w / layer.image.naturalWidth;
        const scaleH = cropRect.h / layer.image.naturalHeight;
        baseScale = Math.max(scaleW, scaleH);
      } else {
        baseScale = (cropRect.w * 0.5) / layer.image.naturalWidth;
      }
      const finalScale = baseScale * layer.settings.zoom;
      const width = layer.image.naturalWidth * finalScale;
      const height = layer.image.naturalHeight * finalScale;

      // Translate point to local space relative to center
      const dx = px - centerX;
      const dy = py - centerY;

      // Undo Rotation
      const rad = -layer.settings.rotation * (Math.PI / 180);
      const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

      // Check bounds
      return Math.abs(localX) < width / 2 && Math.abs(localY) < height / 2;
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

      // 1. Calculate Crop Area
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

      // 2. Draw Viewport Background (Dark)
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // 3. Clip to Crop Area
      ctx.save();
      ctx.beginPath();
      ctx.rect(cropX, cropY, cropW, cropH);
      ctx.clip();

      // 4. Draw User Canvas Background Color
      ctx.fillStyle = props.backgroundColor;
      ctx.fillRect(cropX, cropY, cropW, cropH);

      const centerX = cropX + cropW / 2;
      const centerY = cropY + cropH / 2;

      // 5. Render Layers
      props.layers.forEach((layer) => {
        ctx.save();

        let baseScale;
        if (layer.type === "background") {
          // Background covers crop area
          const scaleW = cropW / layer.image.naturalWidth;
          const scaleH = cropH / layer.image.naturalHeight;
          baseScale = Math.max(scaleW, scaleH);
        } else {
          // Overlays fit inside
          baseScale = (cropW * 0.5) / layer.image.naturalWidth;
        }

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

        // Draw selection border if active
        if (props.activeLayerId === layer.id) {
          ctx.save();
          ctx.translate(centerX + layer.settings.x, centerY + layer.settings.y);
          ctx.rotate((layer.settings.rotation * Math.PI) / 180);

          ctx.strokeStyle = "#3b82f6"; // Brand blue
          ctx.lineWidth = 2 / finalScale; // Keep line width consistent despite scale
          const w = layer.image.naturalWidth;
          const h = layer.image.naturalHeight;
          ctx.strokeRect(-w / 2, -h / 2, w, h);

          // Corner handles (visual only)
          ctx.fillStyle = "#3b82f6";
          const boxSize = 8 / finalScale;
          ctx.fillRect(
            -w / 2 - boxSize / 2,
            -h / 2 - boxSize / 2,
            boxSize,
            boxSize
          );
          ctx.fillRect(
            w / 2 - boxSize / 2,
            h / 2 - boxSize / 2,
            boxSize,
            boxSize
          );

          ctx.restore();
        }
      });

      ctx.restore(); // End Clipping

      // 6. Draw Crop Guide Border (on top of everything)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(cropX, cropY, cropW, cropH);

      // Mask out the area outside the crop (Dimming)
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath();
      ctx.rect(0, 0, rect.width, rect.height);
      ctx.rect(cropX, cropY, cropW, cropH); // Punch hole
      ctx.fill("evenodd");
    }, [
      props.layers,
      props.activeLayerId,
      props.format,
      props.backgroundColor,
    ]);

    // --- Interaction Handlers ---

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

    const handleMouseDown = (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const cropRect = getCropRect();

      // 1. Hit Detection (Reverse order to check top layers first)
      let clickedLayerId: string | null = null;

      for (let i = props.layers.length - 1; i >= 0; i--) {
        const layer = props.layers[i];
        if (isPointInLayer(mouseX, mouseY, layer, cropRect)) {
          clickedLayerId = layer.id;
          break;
        }
      }

      if (clickedLayerId) {
        props.onSelectLayer(clickedLayerId);
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });

        // Capture initial pos of this layer so we calculate delta correctly
        const layer = props.layers.find((l) => l.id === clickedLayerId);
        if (layer) {
          setOriginalLayerPos({ x: layer.settings.x, y: layer.settings.y });
        }
      } else {
        // Deselect if clicked empty space? Or drag background?
        // Let's drag background if nothing else hit, or just do nothing.
        // For now, allow dragging background if nothing hit, assuming user wants to pan BG.
        const bgLayer = props.layers.find((l) => l.type === "background");
        if (bgLayer) {
          props.onSelectLayer(bgLayer.id);
          setIsDragging(true);
          setDragStart({ x: e.clientX, y: e.clientY });
          setOriginalLayerPos({ x: bgLayer.settings.x, y: bgLayer.settings.y });
        }
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !props.activeLayerId) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      props.onUpdatePosition(
        props.activeLayerId,
        originalLayerPos.x + deltaX,
        originalLayerPos.y + deltaY
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    return (
      <div
        ref={containerRef}
        className="w-full h-full relative cursor-move overflow-hidden bg-[#1a1a1a] select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="block" />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-50 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
          <span className="text-[10px] text-white font-mono uppercase tracking-widest">
            {props.activeLayerId ? "Drag to Move" : "Click Image to Select"}
          </span>
        </div>
      </div>
    );
  }
);

CropCanvas.displayName = "CropCanvas";
