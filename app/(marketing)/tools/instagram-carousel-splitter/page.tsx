// app/(marketing)/tools/instagram-carousel-splitter/page.tsx

"use client";

import { useState } from "react";
import { Download, Loader2, Star, Trash2, Scissors } from "lucide-react";
import { processAndDownload, AspectRatio } from "@/lib/tools/image-processing";
import { toast } from "sonner";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { FileUpload } from "./components/file-upload";
import { CarouselControls } from "./components/carousel-controls";
import { ImagePreview } from "./components/image-preview";
import { InfoSection } from "./components/info-section";
import { cn } from "@/lib/utils";

// --- Technical/Schematic Animated Button ---
interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  fillColor: string; // The color that expands
  width?: string;
}

function AnimatedButton({
  icon,
  label,
  fillColor,
  width = "w-[140px]",
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  return (
    <button
      className={cn(
        // Base Layout
        "group relative h-12 flex items-center justify-center overflow-hidden",
        // The "Cutout" Look: Dashed border, flat background
        "border-2 border-dashed border-foreground/30 bg-transparent",
        // Typography
        "font-mono text-xs font-bold uppercase tracking-widest text-foreground",
        // Hover State: Border gets darker/solid to show activity
        "transition-colors duration-300 hover:border-foreground hover:bg-white/50",
        // Disabled State
        "disabled:opacity-50 disabled:pointer-events-none",
        width,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {/* Ink Fill Animation */}
      <span
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[48px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0",
          "group-hover:w-full",
          "opacity-10 group-hover:opacity-100",
          fillColor
        )}
      />

      {/* Vertical Divider Line (Dashed) */}
      <span className="absolute left-[48px] top-2 bottom-2 w-px border-l-2 border-dashed border-foreground/20 transition-opacity duration-200 group-hover:opacity-0" />

      {/* Icon Layer */}
      <span className="absolute left-0 top-0 bottom-0 w-[48px] flex items-center justify-center z-10 pointer-events-none text-foreground group-hover:text-white transition-colors duration-300">
        {icon}
      </span>

      {/* Label Layer */}
      <span
        className={cn(
          "relative z-10 ml-10 transition-colors duration-300",
          "group-hover:text-white"
        )}
      >
        {label}
      </span>
    </button>
  );
}

export default function CarouselSplitterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [columns, setColumns] = useState<number>(3);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("portrait");
  const [gap, setGap] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setColumns(3);
    setAspectRatio("portrait");
    setGap(0);
  };

  const handleDownload = async () => {
    if (!selectedFile) return;
    try {
      setIsProcessing(true);
      await processAndDownload({
        file: selectedFile,
        mode: "carousel",
        columns,
        rows: 1,
        aspectRatio,
        gap,
      });
      toast.success("Carousel created and downloaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Error processing image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-editorial text-foreground font-serif">
      <LandingPageHeader />

      <main className="flex-1 py-16 px-4 md:px-8 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-flex w-fit items-center gap-2 border border-dashed border-foreground/40 bg-white/50 px-3 py-1">
              <Star className="h-4 w-4 fill-current text-brand-primary" />
              <span className="text-xs font-bold font-mono uppercase tracking-widest text-foreground">
                Utility v1.1
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight uppercase">
              Instagram Carousel Splitter
            </h1>
            <p className="font-serif text-xl md:text-2xl text-foreground/80 max-w-2xl leading-relaxed italic border-l-2 border-dotted border-brand-primary pl-6">
              Create seamless panoramic swipes. Split your panoramic images into
              pixel-perfect carousel slides.
            </p>
          </div>

          {/* Main Tool Container */}
          <div className="bg-white border-2 border-double border-foreground p-1.5">
            <div className="border border-dashed border-foreground/30 min-h-[600px] flex flex-col relative bg-surface-hover/30">
              {/* Decorative Corner Marks */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-foreground z-20 -translate-x-0.5 -translate-y-0.5" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-foreground z-20 translate-x-0.5 -translate-y-0.5" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-foreground z-20 -translate-x-0.5 translate-y-0.5" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-foreground z-20 translate-x-0.5 translate-y-0.5" />

              {!selectedFile ? (
                <FileUpload onFileSelect={handleFileSelect} />
              ) : (
                <div className="flex flex-col h-full">
                  <div className="border-b border-dashed border-foreground/30 bg-background-editorial p-4 md:p-6 sticky top-0 z-30">
                    <div className="max-w-6xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-6">
                      <div className="w-full xl:w-auto">
                        <CarouselControls
                          slides={columns}
                          aspectRatio={aspectRatio}
                          onSlidesChange={setColumns}
                          onAspectRatioChange={setAspectRatio}
                        />
                      </div>

                      <div className="h-px w-full xl:w-px xl:h-12 bg-foreground/20 border-t border-dashed border-foreground/30 xl:border-t-0 xl:border-l" />

                      <div className="flex items-center gap-4 w-full xl:w-auto justify-end">
                        <AnimatedButton
                          onClick={handleReset}
                          label="Reset"
                          icon={<Trash2 className="w-4 h-4" />}
                          fillColor="bg-red-500"
                          width="w-[130px]"
                        />

                        <AnimatedButton
                          onClick={handleDownload}
                          disabled={isProcessing}
                          label={isProcessing ? "Working" : "Export"}
                          icon={
                            isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Scissors className="w-4 h-4" />
                            )
                          }
                          fillColor="bg-brand-primary"
                          width="w-[150px]"
                        />
                      </div>
                    </div>
                  </div>

                  <ImagePreview
                    previewUrl={previewUrl!}
                    columns={columns}
                    aspectRatio={aspectRatio}
                  />
                </div>
              )}
            </div>
          </div>

          <InfoSection />
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
