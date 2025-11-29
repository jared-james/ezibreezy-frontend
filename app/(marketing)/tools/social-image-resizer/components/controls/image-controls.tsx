// app/(marketing)/tools/social-image-resizer/components/controls/image-controls.tsx

import {
  ZoomIn,
  RotateCw,
  Palette,
  Layers,
  Plus,
  Undo2,
  X,
  Image as ImageIcon,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Layer } from "../../client";

interface ImageControlsProps {
  layers: Layer[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onAddLayer: () => void;
  onRemoveLayer: (id: string) => void;

  zoom: number;
  onZoomChange: (val: number) => void;
  rotation: number;
  onRotationChange: (val: number) => void;

  backgroundColor: string;
  onBackgroundColorChange: (val: string) => void;
  onReset: () => void;
}

export function ImageControls({
  layers,
  activeLayerId,
  onSelectLayer,
  onAddLayer,
  onRemoveLayer,
  zoom,
  onZoomChange,
  rotation,
  onRotationChange,
  backgroundColor,
  onBackgroundColorChange,
  onReset,
}: ImageControlsProps) {
  // Create a reversed copy for the UI list so top layers appear first
  const displayLayers = [...layers].reverse();

  return (
    <div className="space-y-6">
      {/* Layers Panel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
            <Layers className="w-3 h-3" />
            Layers
          </label>
          <button
            onClick={onAddLayer}
            className="flex items-center gap-1 text-[10px] font-bold text-brand-primary uppercase hover:underline"
          >
            <Plus className="w-3 h-3" /> Add Image
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar bg-white border border-foreground/10 rounded-lg p-2">
          {displayLayers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={cn(
                "flex items-center gap-3 p-2 rounded cursor-pointer border transition-all",
                activeLayerId === layer.id
                  ? "bg-brand-primary/10 border-brand-primary"
                  : "bg-transparent border-transparent hover:bg-surface-hover hover:border-foreground/10"
              )}
            >
              <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 shrink-0 border border-black/5">
                <img
                  src={layer.image.src}
                  className="w-full h-full object-cover"
                  alt="Layer thumb"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">
                  {layer.type === "background" ? "Background" : `Image Layer`}
                </div>
                <div className="text-[9px] font-mono text-foreground/40 truncate">
                  {layer.type === "background" ? "Cover" : "Overlay"}
                </div>
              </div>

              {layer.type !== "background" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLayer(layer.id);
                  }}
                  className="p-1 hover:bg-red-100 hover:text-red-500 rounded transition-colors text-foreground/30"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editing Controls */}
      <div
        className={cn(
          "p-4 bg-white border border-dashed border-foreground/20 rounded-lg space-y-6 transition-opacity",
          !activeLayerId && "opacity-50 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between border-b border-foreground/10 pb-2 mb-2">
          <span className="font-mono text-[10px] font-bold uppercase text-foreground/70 flex items-center gap-2">
            <Box className="w-3 h-3" />
            Transform Selected
          </span>
          <button
            onClick={onReset}
            className="text-[10px] font-mono uppercase text-brand-primary hover:underline flex items-center gap-1"
          >
            <Undo2 className="w-3 h-3" /> Reset
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
              <ZoomIn className="w-3 h-3" />
              Scale
            </label>
            <span className="font-mono text-[10px] font-bold">
              {(zoom * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-foreground/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
              <RotateCw className="w-3 h-3" />
              Rotate
            </label>
            <span className="font-mono text-[10px] font-bold">{rotation}°</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotation}
              onChange={(e) => onRotationChange(parseInt(e.target.value))}
              className="flex-1 h-1 bg-foreground/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
            />
            <button
              onClick={() => onRotationChange((rotation + 90) % 360)}
              className="px-2 py-1 text-[9px] border border-foreground/20 rounded hover:bg-foreground/5"
              title="Rotate +90"
            >
              +90°
            </button>
          </div>
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2">
            <Palette className="w-3 h-3" />
            Canvas Fill
          </label>
          <span className="font-mono text-[10px] font-bold uppercase">
            {backgroundColor}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative w-8 h-8 rounded border border-foreground/20 overflow-hidden shrink-0">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 cursor-pointer"
            />
          </div>
          {["#000000", "#FFFFFF", "#111827", "#f3f4f6", "#3b82f6"].map(
            (color) => (
              <button
                key={color}
                onClick={() => onBackgroundColorChange(color)}
                className="w-6 h-6 rounded-full border border-foreground/10 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
