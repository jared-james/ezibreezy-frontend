// app/(marketing)/tools/youtube-title-checker/page.tsx

"use client";

import { useState } from "react";
import { Star, RefreshCw, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { TitleAnalyzer } from "./components/title-analyzer";
import { PreviewMonitor } from "./components/preview-monitor";
import { InfoSection } from "./components/info-section"; // Reusing or creating new
import { cn } from "@/lib/utils";

// --- Reused Animated Button Component ---
interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  fillColor: string;
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
        "group relative h-12 flex items-center justify-center overflow-hidden",
        "border-2 border-dashed border-foreground/30 bg-transparent",
        "font-mono text-xs font-bold uppercase tracking-widest text-foreground",
        "transition-colors duration-300 hover:border-foreground hover:bg-white/50",
        "disabled:opacity-50 disabled:pointer-events-none",
        width,
        className
      )}
      disabled={disabled}
      {...props}
    >
      <span
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[48px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0",
          "group-hover:w-full",
          "opacity-10 group-hover:opacity-100",
          fillColor
        )}
      />
      <span className="absolute left-[48px] top-2 bottom-2 w-px border-l-2 border-dashed border-foreground/20 transition-opacity duration-200 group-hover:opacity-0" />
      <span className="absolute left-0 top-0 bottom-0 w-[48px] flex items-center justify-center z-10 pointer-events-none text-foreground group-hover:text-white transition-colors duration-300">
        {icon}
      </span>
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

export default function TitleCheckerPage() {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleReset = () => {
    setTitle("");
    setThumbnail(null);
  };

  const handleCopy = () => {
    if (!title) return;
    navigator.clipboard.writeText(title);
    toast.success("Title copied to clipboard");
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
                Utility v1.2
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight uppercase">
              YouTube Title Checker
            </h1>
            <p className="font-serif text-xl md:text-2xl text-foreground/80 max-w-2xl leading-relaxed italic border-l-2 border-dotted border-brand-primary pl-6">
              Prevent truncation. Optimize for retention. Preview your headline
              exactly as it appears in the feed.
            </p>
          </div>

          {/* Main Tool Container */}
          <div className="bg-white border-2 border-double border-foreground p-1.5">
            <div className="border border-dashed border-foreground/30 min-h-[600px] flex flex-col xl:flex-row relative bg-surface-hover/30">
              {/* Decorative Corner Marks */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-foreground z-20 -translate-x-0.5 -translate-y-0.5" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-foreground z-20 translate-x-0.5 -translate-y-0.5" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-foreground z-20 -translate-x-0.5 translate-y-0.5" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-foreground z-20 translate-x-0.5 translate-y-0.5" />

              {/* Left Column: Input & Analysis */}
              <div className="w-full xl:w-1/2 p-6 md:p-8 flex flex-col gap-8 border-b xl:border-b-0 xl:border-r border-dashed border-foreground/30 bg-background-editorial">
                <TitleAnalyzer
                  title={title}
                  onTitleChange={setTitle}
                  thumbnail={thumbnail}
                  onThumbnailChange={setThumbnail}
                />

                <div className="mt-auto flex gap-4 pt-8 border-t border-dashed border-foreground/30">
                  <AnimatedButton
                    onClick={handleReset}
                    label="Reset"
                    icon={<RefreshCw className="w-4 h-4" />}
                    fillColor="bg-red-500"
                    width="w-[130px]"
                  />
                  <AnimatedButton
                    onClick={handleCopy}
                    disabled={!title}
                    label="Copy"
                    icon={<Copy className="w-4 h-4" />}
                    fillColor="bg-brand-primary"
                    width="w-[130px]"
                  />
                </div>
              </div>

              {/* Right Column: Visual Preview */}
              <div className="w-full xl:w-1/2 bg-surface-hover/10">
                <PreviewMonitor title={title} thumbnail={thumbnail} />
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
