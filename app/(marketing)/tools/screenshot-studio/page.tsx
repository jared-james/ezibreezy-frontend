// app/(marketing)/tools/screenshot-studio/page.tsx

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Star,
  Download,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { EditorCanvas } from "./components/editor-canvas";
import { EditorControls } from "./components/editor-controls";
import { InfoSection } from "./components/info-section";
import { cn } from "@/lib/utils";

// Types
export type BackgroundStyle = {
  id: string;
  type: "solid" | "gradient" | "glass" | "custom";
  value: string | string[];
  label: string;
};

export type AspectRatio =
  | "auto"
  | "1:1"
  | "4:5"
  | "16:9"
  | "1.91:1"
  | "3:2"
  | "4:3"
  | "9:16";

// Default Settings
export const DEFAULT_SETTINGS = {
  padding: 60,
  roundness: 12,
  outerRoundness: 0,
  shadow: 50,
  windowChrome: true, // New Default
  backgroundId: "grad_1",
  aspectRatio: "auto" as AspectRatio,
};

export default function ScreenshotStudioPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // Settings
  const [padding, setPadding] = useState(DEFAULT_SETTINGS.padding);
  const [roundness, setRoundness] = useState(DEFAULT_SETTINGS.roundness);
  const [outerRoundness, setOuterRoundness] = useState(
    DEFAULT_SETTINGS.outerRoundness
  );
  const [shadow, setShadow] = useState(DEFAULT_SETTINGS.shadow);
  const [windowChrome, setWindowChrome] = useState(
    DEFAULT_SETTINGS.windowChrome
  );
  const [backgroundId, setBackgroundId] = useState(
    DEFAULT_SETTINGS.backgroundId
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    DEFAULT_SETTINGS.aspectRatio
  );

  // Custom Color States
  const [customColors, setCustomColors] = useState<[string, string]>([
    "#6366f1",
    "#a855f7",
  ]);
  const [useCustomGradient, setUseCustomGradient] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const canvasRef = useRef<{ download: () => void; copy: () => Promise<void> }>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please paste or upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        toast.success("Image loaded successfully");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            processFile(file);
          }
          break;
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [processFile]);

  const handleReset = () => {
    setImage(null);
    setPadding(DEFAULT_SETTINGS.padding);
    setRoundness(DEFAULT_SETTINGS.roundness);
    setOuterRoundness(DEFAULT_SETTINGS.outerRoundness);
    setShadow(DEFAULT_SETTINGS.shadow);
    setWindowChrome(DEFAULT_SETTINGS.windowChrome);
    setBackgroundId(DEFAULT_SETTINGS.backgroundId);
    setAspectRatio(DEFAULT_SETTINGS.aspectRatio);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      setIsProcessing(true);
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
        // Small delay to ensure UI updates before heavy canvas op
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
    <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
      <LandingPageHeader />

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
                Utility v1.6
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight uppercase">
              Screenshot Studio
            </h1>
            <p className="font-serif text-xl md:text-2xl text-foreground/80 max-w-2xl leading-relaxed italic border-l-2 border-dotted border-brand-primary pl-6">
              Turn messy screenshots into editorial assets. Add backgrounds,
              browser frames, and shadows instantly.
            </p>
          </div>

          <div className="bg-white border-2 border-double border-foreground p-1.5">
            <div className="border border-dashed border-foreground/30 min-h-[600px] flex flex-col xl:flex-row relative bg-surface-hover/30">
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-foreground z-20 -translate-x-0.5 -translate-y-0.5" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-foreground z-20 translate-x-0.5 -translate-y-0.5" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-foreground z-20 -translate-x-0.5 translate-y-0.5" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-foreground z-20 translate-x-0.5 translate-y-0.5" />

              {/* Controls */}
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
                    windowChrome={windowChrome}
                    setWindowChrome={setWindowChrome}
                    backgroundId={backgroundId}
                    setBackgroundId={setBackgroundId}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    customColors={customColors}
                    setCustomColors={setCustomColors}
                    useCustomGradient={useCustomGradient}
                    setUseCustomGradient={setUseCustomGradient}
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

              {/* Canvas Preview */}
              <div className="flex-1 bg-surface-hover/30 p-4 md:p-12 flex items-center justify-center overflow-hidden relative">
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
                  <div className="max-w-full max-h-full shadow-2xl drop-shadow-2xl">
                    <EditorCanvas
                      ref={canvasRef}
                      image={image}
                      padding={padding}
                      roundness={roundness}
                      outerRoundness={outerRoundness}
                      shadow={shadow}
                      windowChrome={windowChrome}
                      backgroundId={backgroundId}
                      aspectRatio={aspectRatio}
                      customColors={customColors}
                      useCustomGradient={useCustomGradient}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <InfoSection />
        </div>
      </main>
      <LandingPageFooter />
    </div>
  );
}
