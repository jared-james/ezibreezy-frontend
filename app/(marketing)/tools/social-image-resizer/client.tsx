// app/(marketing)/tools/social-image-resizer/client.tsx

"use client";

import { useState, useRef } from "react";
import { Download, Images, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import posthog from "posthog-js";

import { FileUpload } from "./components/file-upload";
import { CropCanvas, CropCanvasRef } from "./components/crop-canvas";
import { FormatSelector } from "./components/controls/format-selector";
import { ImageControls } from "./components/controls/image-controls";
import { InfoSection } from "./components/info-section";

import { SOCIAL_FORMATS, DEFAULT_FORMAT } from "./constants";

// --- Types ---

export interface Layer {
  id: string;
  type: "background" | "image";
  image: HTMLImageElement;
  settings: {
    zoom: number;
    rotation: number;
    x: number; // Offset X
    y: number; // Offset Y
  };
}

// --- Main Component ---

export default function SocialResizerClient() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  const [activeFormatId, setActiveFormatId] = useState(DEFAULT_FORMAT.id);
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<CropCanvasRef>(null);
  const layerInputRef = useRef<HTMLInputElement>(null);

  const activeFormat =
    SOCIAL_FORMATS.find((f) => f.id === activeFormatId) || DEFAULT_FORMAT;

  const activeLayer = layers.find((l) => l.id === activeLayerId) || null;

  // --- Handlers ---

  const handleMainFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const bgLayer: Layer = {
          id: "bg-main",
          type: "background",
          image: img,
          settings: { zoom: 1, rotation: 0, x: 0, y: 0 },
        };
        setLayers([bgLayer]);
        setActiveLayerId("bg-main");
        toast.success("Image loaded");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddLayer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const newLayer: Layer = {
          id: `layer-${Date.now()}`,
          type: "image",
          image: img,
          settings: { zoom: 1, rotation: 0, x: 0, y: 0 },
        };
        // Add to end of array (top of stack)
        setLayers((prev) => [...prev, newLayer]);
        setActiveLayerId(newLayer.id);
        toast.success("Layer added");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleUpdateSettings = (
    key: keyof Layer["settings"],
    value: number
  ) => {
    if (!activeLayerId) return;

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === activeLayerId
          ? { ...layer, settings: { ...layer.settings, [key]: value } }
          : layer
      )
    );
  };

  const handleRemoveLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (activeLayerId === id) {
      setActiveLayerId(null);
    }
    toast.success("Layer removed");
  };

  const handleResetActiveLayer = () => {
    if (!activeLayerId) return;
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === activeLayerId
          ? { ...layer, settings: { zoom: 1, rotation: 0, x: 0, y: 0 } }
          : layer
      )
    );
    toast.info("Layer reset");
  };

  const handleDownload = () => {
    if (layers.length === 0 || !canvasRef.current) return;

    setIsProcessing(true);
    posthog.capture("marketing_tool_used", {
      tool_name: "social-image-resizer",
      format: activeFormat.id,
      layer_count: layers.length,
    });

    setTimeout(() => {
      canvasRef.current?.download();
      setIsProcessing(false);
      toast.success(`Downloaded ${activeFormat.label}`);
    }, 100);
  };

  // Callback from Canvas when user clicks an image
  const handleCanvasSelectLayer = (id: string) => {
    setActiveLayerId(id);
  };

  // Callback from Canvas when dragging (updates X/Y in real time)
  const handleCanvasUpdatePosition = (id: string, x: number, y: number) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id
          ? { ...layer, settings: { ...layer.settings, x, y } }
          : layer
      )
    );
  };

  return (
    <main className="flex-1 py-16 px-4 md:px-8 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-flex w-fit items-center gap-2 border border-dashed border-foreground/40 bg-white/50 px-3 py-1">
            <Images className="h-4 w-4 fill-current text-brand-primary" />
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-foreground">
              Utility v2.0
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight uppercase">
            Social Image Resizer
          </h1>
          <p className="font-serif text-xl md:text-2xl text-foreground/80 max-w-2xl leading-relaxed italic border-l-2 border-dotted border-brand-primary pl-6">
            Multi-layer compositor. Crop background, add floating images, and
            export for any platform.
          </p>
        </div>

        <div className="bg-white border-2 border-double border-foreground p-1.5">
          <div className="border border-dashed border-foreground/30 min-h-[600px] flex flex-col xl:flex-row relative bg-surface-hover/30">
            {/* Corner Marks */}
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-foreground z-20 -translate-x-0.5 -translate-y-0.5" />
            <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-foreground z-20 translate-x-0.5 -translate-y-0.5" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-foreground z-20 -translate-x-0.5 translate-y-0.5" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-foreground z-20 translate-x-0.5 translate-y-0.5" />

            {layers.length === 0 ? (
              <FileUpload onFileSelect={handleMainFileSelect} />
            ) : (
              <>
                {/* Left Controls */}
                <div className="w-full xl:w-[400px] p-6 md:p-8 flex flex-col gap-8 border-b xl:border-b-0 xl:border-r border-dashed border-foreground/30 bg-background-editorial z-10 overflow-y-auto max-h-[800px]">
                  {/* Format */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                        1. Target Format
                      </label>
                      <span className="text-[10px] font-mono text-foreground/40">
                        {activeFormat.width}x{activeFormat.height}
                      </span>
                    </div>
                    <FormatSelector
                      activeFormatId={activeFormatId}
                      onSelect={setActiveFormatId}
                    />
                  </div>

                  <div className="w-full h-px bg-foreground/10 border-t border-dashed border-foreground/20" />

                  {/* Layers & Adjustments */}
                  <div className="space-y-4">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                      2. Layers & Controls
                    </label>

                    <ImageControls
                      layers={layers}
                      activeLayerId={activeLayerId}
                      onSelectLayer={setActiveLayerId}
                      onAddLayer={() => layerInputRef.current?.click()}
                      onRemoveLayer={handleRemoveLayer}
                      zoom={activeLayer?.settings.zoom || 1}
                      onZoomChange={(val) => handleUpdateSettings("zoom", val)}
                      rotation={activeLayer?.settings.rotation || 0}
                      onRotationChange={(val) =>
                        handleUpdateSettings("rotation", val)
                      }
                      backgroundColor={backgroundColor}
                      onBackgroundColorChange={setBackgroundColor}
                      onReset={handleResetActiveLayer}
                    />

                    <input
                      type="file"
                      ref={layerInputRef}
                      className="hidden"
                      onChange={handleAddLayer}
                      accept="image/*"
                    />
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-auto pt-8 border-t border-dashed border-foreground/30 flex flex-col gap-3">
                    <button
                      onClick={() => {
                        if (confirm("Remove all layers?")) {
                          setLayers([]);
                        }
                      }}
                      className="flex items-center justify-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-red-500/70 hover:text-red-600 transition-colors py-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear All
                    </button>

                    <button
                      onClick={handleDownload}
                      disabled={isProcessing}
                      className={cn(
                        "w-full h-12 flex items-center justify-center gap-2 bg-brand-primary text-white font-mono text-xs font-bold uppercase tracking-widest transition-all hover:bg-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
                        isProcessing && "opacity-80 pointer-events-none"
                      )}
                    >
                      <Download className="w-4 h-4" />
                      {isProcessing
                        ? "Exporting..."
                        : `Export ${activeFormat.label}`}
                    </button>
                  </div>
                </div>

                {/* Right Canvas */}
                <div className="flex-1 bg-[#1a1a1a] relative flex flex-col overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2">
                      <activeFormat.icon className="w-3 h-3" />
                      <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                        {activeFormat.platform} • {activeFormat.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 relative w-full h-full p-8 md:p-12">
                    <CropCanvas
                      ref={canvasRef}
                      layers={layers}
                      activeLayerId={activeLayerId}
                      format={activeFormat}
                      backgroundColor={backgroundColor}
                      onSelectLayer={handleCanvasSelectLayer}
                      onUpdatePosition={handleCanvasUpdatePosition}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <InfoSection />
      </div>
    </main>
  );
}
