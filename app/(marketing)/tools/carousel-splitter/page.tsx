// app/(marketing)/tools/carousel-splitter/page.tsx

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  X,
  Download,
  Loader2,
  ArrowRight,
  LayoutGrid,
  Images,
  Maximize,
  Smartphone,
  Square,
  Lock,
} from "lucide-react";
import {
  processAndDownload,
  SplitMode,
  AspectRatio,
} from "@/lib/tools/image-processing";
import { toast } from "sonner";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { cn } from "@/lib/utils";

export default function CarouselSplitterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<SplitMode>("carousel");
  const [columns, setColumns] = useState<number>(3);
  const [rows, setRows] = useState<number>(3);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("portrait");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setMode("carousel");
    setColumns(3);
    setRows(3);
  };

  const switchMode = (newMode: SplitMode) => {
    setMode(newMode);
    if (newMode === "grid") {
      setColumns(3); // Lock to 3 for grid
      setRows(3); // Default to 3x3
    } else {
      setColumns(3); // Reset to 3 slides default for carousel
    }
  };

  const handleDownload = async () => {
    if (!selectedFile) return;
    try {
      setIsProcessing(true);
      await processAndDownload({
        file: selectedFile,
        mode,
        columns,
        rows,
        aspectRatio,
      });
      toast.success("Downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error processing image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getPreviewStyle = () => {
    if (mode === "carousel") {
      let ratioMultiplier = 1;
      if (aspectRatio === "portrait") ratioMultiplier = 0.8;
      if (aspectRatio === "landscape") ratioMultiplier = 1.91;

      if (aspectRatio === "original")
        return { height: "400px", width: "auto", aspectRatio: "auto" };

      return {
        aspectRatio: `${columns * ratioMultiplier} / 1`,
        height: "auto",
        maxHeight: "500px",
        width: "100%",
      };
    }

    // Grid Mode: 3 columns fixed, N rows
    return {
      aspectRatio: `${3} / ${rows}`,
      height: "auto",
      maxHeight: "500px",
      width: "100%",
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-editorial text-foreground">
      <LandingPageHeader />

      <main className="flex-1 py-12 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="headline text-4xl md:text-6xl font-bold">
              Instagram Image Splitter
            </h1>
            <p className="subheadline max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Split images into seamless carousels or profile grids without
              losing quality.
            </p>
          </div>

          <div className="bg-surface border-2 border-dashed border-border rounded-xl shadow-xl overflow-hidden relative min-h-[600px] flex flex-col">
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative z-10 flex-1 flex flex-col">
              {!selectedFile ? (
                <div
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-6 cursor-pointer p-12 hover:bg-surface-hover/50 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                >
                  <div className="w-24 h-24 bg-background-editorial rounded-full flex items-center justify-center border border-border shadow-sm mb-4">
                    <Upload className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-3xl font-bold">
                      Upload Image
                    </h3>
                    <p className="font-sans text-muted-foreground">
                      Drag & drop or click to browse <br />
                      <span className="opacity-60 text-xs">
                        (JPG, PNG, WEBP)
                      </span>
                    </p>
                  </div>
                  <button className="btn btn-primary px-10 py-3 text-sm">
                    Select Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={onFileChange}
                    accept="image/*"
                  />
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Controls Bar */}
                  <div className="border-b border-border bg-white/80 backdrop-blur-sm p-4 sticky top-0 z-30">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Mode Switcher */}
                      <div className="flex bg-surface-hover p-1 rounded-lg border border-border">
                        <button
                          onClick={() => switchMode("carousel")}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all",
                            mode === "carousel"
                              ? "bg-white shadow-sm text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Images className="w-4 h-4" /> Carousel
                        </button>
                        <button
                          onClick={() => switchMode("grid")}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all",
                            mode === "grid"
                              ? "bg-white shadow-sm text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <LayoutGrid className="w-4 h-4" /> Grid
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        {mode === "carousel" ? (
                          /* CAROUSEL CONTROLS */
                          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-border">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase text-muted-foreground">
                                Slides
                              </span>
                              <input
                                type="number"
                                min={2}
                                max={10}
                                value={columns}
                                onChange={(e) =>
                                  setColumns(
                                    Math.min(
                                      10,
                                      Math.max(2, parseInt(e.target.value) || 2)
                                    )
                                  )
                                }
                                className="w-12 h-8 border border-border rounded text-center font-mono text-sm focus:ring-1 focus:ring-brand-primary outline-none"
                              />
                            </div>
                            <div className="w-px h-6 bg-border" />
                            <div className="flex gap-1">
                              <button
                                onClick={() => setAspectRatio("square")}
                                title="Square (1:1)"
                                className={cn(
                                  "p-1.5 rounded hover:bg-surface-hover border",
                                  aspectRatio === "square"
                                    ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                                    : "border-transparent text-muted-foreground"
                                )}
                              >
                                <Square className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setAspectRatio("portrait")}
                                title="Portrait (4:5)"
                                className={cn(
                                  "p-1.5 rounded hover:bg-surface-hover border",
                                  aspectRatio === "portrait"
                                    ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                                    : "border-transparent text-muted-foreground"
                                )}
                              >
                                <Smartphone className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setAspectRatio("original")}
                                title="Original Ratio"
                                className={cn(
                                  "p-1.5 rounded hover:bg-surface-hover border",
                                  aspectRatio === "original"
                                    ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                                    : "border-transparent text-muted-foreground"
                                )}
                              >
                                <Maximize className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* GRID CONTROLS */
                          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-border">
                            <div
                              className="flex items-center gap-2 opacity-60"
                              title="Instagram profile grids are always 3 columns wide"
                            >
                              <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                                Cols <Lock className="w-3 h-3" />
                              </span>
                              <input
                                type="number"
                                value={3}
                                disabled
                                className="w-12 h-8 border border-border rounded text-center font-mono text-sm bg-gray-100 text-muted-foreground cursor-not-allowed"
                              />
                            </div>
                            <span className="text-muted-foreground">×</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase text-muted-foreground">
                                Rows
                              </span>
                              <input
                                type="number"
                                min={1}
                                max={9}
                                value={rows}
                                onChange={(e) =>
                                  setRows(
                                    Math.min(
                                      9,
                                      Math.max(1, parseInt(e.target.value) || 1)
                                    )
                                  )
                                }
                                className="w-12 h-8 border border-border rounded text-center font-mono text-sm focus:ring-1 focus:ring-brand-primary outline-none"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={handleReset}
                            className="btn btn-outline h-10 px-3"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleDownload}
                            disabled={isProcessing}
                            className="btn btn-primary h-10 px-6 gap-2"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                              Download ZIP
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div className="flex-1 bg-gray-50/50 p-8 flex items-center justify-center overflow-auto">
                    <div className="relative shadow-2xl bg-white max-w-full">
                      <div
                        className="relative overflow-hidden"
                        style={getPreviewStyle()}
                      >
                        <img
                          src={previewUrl!}
                          alt="Preview"
                          className={cn(
                            "w-full h-full",
                            mode === "carousel" && aspectRatio !== "original"
                              ? "object-cover"
                              : "object-contain"
                          )}
                        />

                        <div className="absolute inset-0 z-20 pointer-events-none">
                          <div
                            className="w-full h-full grid"
                            style={{
                              gridTemplateColumns: `repeat(${columns}, 1fr)`,
                              gridTemplateRows:
                                mode === "grid"
                                  ? `repeat(${rows}, 1fr)`
                                  : "1fr",
                            }}
                          >
                            {Array.from({
                              length: columns * (mode === "grid" ? rows : 1),
                            }).map((_, i) => (
                              <div
                                key={i}
                                className="border border-white/50 border-dashed relative"
                              >
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                                  {i + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-border">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl font-bold">
                Why split your images?
              </h2>
              <p className="article-body text-muted-foreground">
                <strong>Carousels:</strong> Seamless panoramic carousels
                encourage users to swipe left, increasing engagement time and
                algorithm ranking.
                <br />
                <br />
                <strong>Grids:</strong> Splitting a large image into a 3x3 grid
                allows you to dominate your profile feed with a massive banner
                that stands out to new visitors.
              </p>
            </div>

            <div className="bg-brand-primary/5 border border-brand-primary/10 p-8 rounded-lg">
              <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">
                Manage your entire feed
              </h3>
              <p className="text-sm text-foreground/80 mb-6 leading-relaxed">
                EziBreezy isn't just for splitting images. It's a complete
                editorial workspace to draft, schedule, and publish your content
                across all platforms.
              </p>
              <Link
                href="/"
                className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-brand-primary hover:underline underline-offset-4"
              >
                Start for free <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
