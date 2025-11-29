// app/(marketing)/tools/screenshot-studio/client.tsx

"use client";

import { useState, useRef } from "react";
import {
  Download,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Star,
  Eye,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { EditorCanvas } from "./components/editor-canvas";
import { EditorControls } from "./components/editor-controls";
import { InfoSection } from "./components/info-section";
import { cn } from "@/lib/utils";
import { AspectRatio, TextLayer, DEFAULT_SETTINGS } from "./constants";
import { useImageUpload } from "./hooks/use-image-upload";
import { useTextDrag } from "./hooks/use-text-drag";
import { BackgroundSelector } from "./components/controls/background-selector";
import posthog from "posthog-js";

export default function ScreenshotStudioClient() {
  const { image, setImage, fileInputRef, handleFileSelect } = useImageUpload();

  const [padding, setPadding] = useState(DEFAULT_SETTINGS.padding);
  const [roundness, setRoundness] = useState(DEFAULT_SETTINGS.roundness);
  const [outerRoundness, setOuterRoundness] = useState(
    DEFAULT_SETTINGS.outerRoundness
  );
  const [shadow, setShadow] = useState(DEFAULT_SETTINGS.shadow);
  const [shadowColor, setShadowColor] = useState(DEFAULT_SETTINGS.shadowColor);
  const [reflection, setReflection] = useState(DEFAULT_SETTINGS.reflection);
  const [windowChrome, setWindowChrome] = useState(
    DEFAULT_SETTINGS.windowChrome
  );

  const [showGlass, setShowGlass] = useState(false);
  const [glassPlane, setGlassPlane] = useState(30);

  const [backgroundId, setBackgroundId] = useState(
    DEFAULT_SETTINGS.backgroundId
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    DEFAULT_SETTINGS.aspectRatio
  );

  const [textLayer, setTextLayer] = useState<TextLayer>(
    DEFAULT_SETTINGS.textLayer
  );

  const [customColors, setCustomColors] = useState<[string, string]>([
    "#6366f1",
    "#a855f7",
  ]);
  const [useCustomGradient, setUseCustomGradient] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const { textElementRef, handleTextMouseDown } = useTextDrag({
    textLayer,
    setTextLayer,
    canvasWrapperRef,
  });

  const canvasRef = useRef<{
    download: () => void;
    copy: () => Promise<void>;
    getDataUrl: () => string | null;
    getCanvasWidth: () => number;
  }>(null);

  const handleReset = () => {
    setImage(null);
    setPadding(DEFAULT_SETTINGS.padding);
    setRoundness(DEFAULT_SETTINGS.roundness);
    setOuterRoundness(DEFAULT_SETTINGS.outerRoundness);
    setShadow(DEFAULT_SETTINGS.shadow);
    setShadowColor(DEFAULT_SETTINGS.shadowColor);
    setReflection(DEFAULT_SETTINGS.reflection);
    setWindowChrome(DEFAULT_SETTINGS.windowChrome);
    setShowGlass(false);
    setGlassPlane(30);
    setBackgroundId(DEFAULT_SETTINGS.backgroundId);
    setAspectRatio(DEFAULT_SETTINGS.aspectRatio);
    setTextLayer(DEFAULT_SETTINGS.textLayer);
  };

  const handlePreview = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.getDataUrl();
      if (url) {
        setPreviewUrl(url);
      }
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      setIsProcessing(true);

      posthog.capture("marketing_tool_used", {
        tool_name: "screenshot-studio",
        action: "download",
        settings: {
          background_id: backgroundId,
          aspect_ratio: aspectRatio,
          window_chrome: windowChrome,
        },
      });

      setTimeout(() => {
        canvasRef.current?.download();
        setIsProcessing(false);
        toast.success("Image downloaded successfully");
      }, 100);
    }
  };

  const handleCopy = async () => {
    if (canvasRef.current) {
      try {
        setIsCopying(true);
        setTimeout(async () => {
          await canvasRef.current?.copy();
          setIsCopying(false);
          toast.success("Copied to clipboard!");
        }, 50);
      } catch (err) {
        setIsCopying(false);
        toast.error("Failed to copy image.");
        console.error(err);
      }
    }
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
            <Star className="h-4 w-4 fill-current text-brand-primary" />
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-foreground">
              Utility v1.8
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight uppercase">
            Screenshot Studio
          </h1>
          <p className="font-serif text-xl md:text-2xl text-foreground/80 max-w-2xl leading-relaxed italic border-l-2 border-dotted border-brand-primary pl-6">
            Turn messy screenshots into editorial assets. Add backgrounds, text,
            and shadows instantly.
          </p>
        </div>

        <div className="bg-white border-2 border-double border-foreground p-1.5">
          <div className="border border-dashed border-foreground/30 min-h-[600px] flex flex-col relative bg-surface-hover/30">
            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-foreground z-20 -translate-x-0.5 -translate-y-0.5" />
            <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-foreground z-20 translate-x-0.5 -translate-y-0.5" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-foreground z-20 -translate-x-0.5 translate-y-0.5" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-foreground z-20 translate-x-0.5 translate-y-0.5" />

            <div className="flex-1 flex flex-col xl:flex-row">
              <div className="w-full xl:w-[400px] p-6 md:p-8 flex flex-col gap-8 border-b xl:border-b-0 xl:border-r border-dashed border-foreground/30 bg-background-editorial z-10">
                {!image ? (
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-foreground/20 bg-white/50">
                    <div className="mb-4 p-3 bg-brand-primary/5 rounded-full">
                      <Upload className="w-6 h-6 text-brand-primary" />
                    </div>
                    <h3 className="font-bold mb-2">Start Here</h3>
                    <p className="text-sm text-foreground/60 mb-4">
                      Paste (Ctrl+V) or upload an image.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-brand-primary text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-foreground transition-colors"
                    >
                      Select Image
                    </button>
                  </div>
                ) : (
                  <EditorControls
                    padding={padding}
                    setPadding={setPadding}
                    roundness={roundness}
                    setRoundness={setRoundness}
                    outerRoundness={outerRoundness}
                    setOuterRoundness={setOuterRoundness}
                    shadow={shadow}
                    setShadow={setShadow}
                    shadowColor={shadowColor}
                    setShadowColor={setShadowColor}
                    reflection={reflection}
                    setReflection={setReflection}
                    windowChrome={windowChrome}
                    setWindowChrome={setWindowChrome}
                    showGlass={showGlass}
                    setShowGlass={setShowGlass}
                    glassPlane={glassPlane}
                    setGlassPlane={setGlassPlane}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    textLayer={textLayer}
                    setTextLayer={setTextLayer}
                  />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />

                <div className="mt-auto pt-8 border-t border-dashed border-foreground/30 flex flex-col gap-3">
                  {image && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-foreground/50 hover:text-foreground transition-colors py-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Replace Image
                    </button>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={handlePreview}
                      disabled={!image}
                      className={cn(
                        "h-12 w-12 flex items-center justify-center border-2 border-foreground bg-white hover:bg-surface-hover text-foreground transition-all shrink-0",
                        !image && "opacity-50 pointer-events-none"
                      )}
                      title="View Full Size"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleCopy}
                      disabled={!image || isCopying}
                      className={cn(
                        "flex-[1.5] h-12 flex items-center justify-center gap-2 border-2 border-foreground bg-white hover:bg-surface-hover text-foreground font-mono text-xs font-bold uppercase tracking-widest transition-all",
                        (!image || isCopying) &&
                          "opacity-50 pointer-events-none"
                      )}
                      title="Copy to Clipboard"
                    >
                      {isCopying ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      Copy
                    </button>

                    <button
                      onClick={handleDownload}
                      disabled={!image || isProcessing}
                      className={cn(
                        "flex-[2] h-12 flex items-center justify-center gap-2 bg-brand-primary text-white font-mono text-xs font-bold uppercase tracking-widest transition-all hover:bg-foreground",
                        (!image || isProcessing) &&
                          "opacity-50 pointer-events-none"
                      )}
                    >
                      <Download className="w-4 h-4" />
                      {isProcessing ? "Wait" : "Save"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-surface-hover/30">
                {image && (
                  <div className="p-6 md:p-8 border-b border-dashed border-foreground/30 bg-background-editorial">
                    <BackgroundSelector
                      backgroundId={backgroundId}
                      setBackgroundId={setBackgroundId}
                      customColors={customColors}
                      setCustomColors={setCustomColors}
                      useCustomGradient={useCustomGradient}
                      setUseCustomGradient={setUseCustomGradient}
                    />
                  </div>
                )}

                <div className="flex-1 p-4 md:p-12 flex items-center justify-center overflow-hidden relative">
                  {!image ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full max-w-md aspect-[4/3] border-2 border-dashed border-foreground/20 bg-white/50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-white transition-all group"
                    >
                      <ImageIcon className="w-12 h-12 text-foreground/20 group-hover:text-brand-primary group-hover:scale-110 transition-all mb-4" />
                      <span className="font-serif text-xl font-bold text-foreground/40 group-hover:text-foreground transition-colors">
                        Paste Image (Ctrl+V)
                      </span>
                    </div>
                  ) : (
                    <div
                      ref={canvasWrapperRef}
                      className="relative max-w-full max-h-full drop-shadow-2xl"
                    >
                      <EditorCanvas
                        ref={canvasRef}
                        image={image}
                        padding={padding}
                        roundness={roundness}
                        outerRoundness={outerRoundness}
                        shadow={shadow}
                        shadowColor={shadowColor}
                        reflection={reflection}
                        windowChrome={windowChrome}
                        showGlass={showGlass}
                        glassPlane={glassPlane}
                        backgroundId={backgroundId}
                        aspectRatio={aspectRatio}
                        customColors={customColors}
                        useCustomGradient={useCustomGradient}
                        textLayer={textLayer}
                        renderTextOnCanvas={false}
                      />

                      {textLayer.text && (
                        <div
                          ref={textElementRef}
                          onMouseDown={handleTextMouseDown}
                          className="absolute cursor-move select-none whitespace-nowrap z-50 font-bold hover:ring-2 ring-brand-primary/50 rounded px-2"
                          style={{
                            left: `${textLayer.x}%`,
                            top: `${textLayer.y}%`,
                            transform: "translate(-50%, -50%)",
                            color: textLayer.color,
                            fontSize: `${textLayer.fontSize * 0.8}px`,
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                            fontFamily: textLayer.fontFamily,
                          }}
                        >
                          {textLayer.text}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <InfoSection />
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10 animate-in fade-in duration-200"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative max-w-full max-h-full overflow-auto rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewUrl}
              alt="Full size preview"
              className="max-w-full h-auto object-contain rounded"
            />
          </div>
        </div>
      )}
    </main>
  );
}
