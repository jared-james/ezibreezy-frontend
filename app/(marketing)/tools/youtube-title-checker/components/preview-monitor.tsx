// app/(marketing)/tools/youtube-title-checker/components/preview-monitor.tsx

import { useState } from "react";
import { Monitor, Smartphone, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewMonitorProps {
  title: string;
  thumbnail: string | null;
}

const MAX_TITLE_CHARS = 55;

export function PreviewMonitor({ title, thumbnail }: PreviewMonitorProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const displayTitle = title || "Your video title will appear here...";

  const truncatedTitle =
    displayTitle.length > MAX_TITLE_CHARS
      ? displayTitle.slice(0, MAX_TITLE_CHARS).trimEnd() + "…"
      : displayTitle;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-dashed border-foreground/30 bg-background-editorial p-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold">Feed Simulation</h3>

        <div className="flex items-center bg-white border border-foreground/20 p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setViewMode("desktop")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold font-mono uppercase tracking-wider",
              viewMode === "desktop"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-foreground/50 hover:bg-foreground/5"
            )}
          >
            <Monitor className="w-3 h-3" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs font-bold font-mono uppercase tracking-wider",
              viewMode === "mobile"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-foreground/50 hover:bg-foreground/5"
            )}
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Display Area */}
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-auto bg-surface-hover/30">
        {/* VIEW: Desktop */}
        {viewMode === "desktop" && (
          <div className="w-full max-w-[600px] bg-white p-4 shadow-sm border border-foreground/10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex gap-4 items-start">
              {/* Thumbnail */}
              <div className="relative w-[240px] aspect-video bg-black/90 flex-shrink-0 rounded-lg overflow-hidden border border-foreground/10 group">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1 rounded">
                  12:42
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pt-1">
                <h4 className="font-sans font-semibold text-lg leading-tight text-black mb-2">
                  {truncatedTitle}
                </h4>
                <div className="flex flex-col gap-1 text-xs text-gray-500 font-sans">
                  <div className="flex items-center gap-1 hover:text-gray-700">
                    <span>Channel Name</span>
                    <div className="w-3 h-3 bg-gray-300 rounded-full flex items-center justify-center text-[8px] text-white">
                      ✓
                    </div>
                  </div>
                  <span>12K views • 2 hours ago</span>
                </div>
                <div className="mt-2 text-xs text-gray-500 line-clamp-1">
                  A brief description of the video content would go here in the
                  search results view...
                </div>
              </div>

              <MoreVertical className="w-5 h-5 text-gray-400 shrink-0" />
            </div>
          </div>
        )}

        {/* VIEW: Mobile */}
        {viewMode === "mobile" && (
          <div className="w-[320px] bg-white shadow-xl border border-foreground/10 rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-500">
            {/* Status Bar */}
            <div className="h-6 bg-black text-white flex justify-between items-center px-4 text-[10px] font-bold">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
              </div>
            </div>

            <div className="pb-4">
              {/* Thumbnail */}
              <div className="w-full aspect-video bg-black/90 relative">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1 rounded">
                  12:42
                </div>
              </div>

              {/* Meta */}
              <div className="flex gap-3 px-3 pt-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans text-[15px] font-medium leading-tight text-black mb-1">
                    {truncatedTitle}
                  </h4>
                  <div className="textxs text-gray-500 font-sans text-[12px]">
                    Channel Name • 12K views • 2h ago
                  </div>
                </div>
                <MoreVertical className="w-4 h-4 text-gray-500 shrink-0" />
              </div>
            </div>

            {/* Mock Next Video */}
            <div className="mt-2 border-t border-gray-100 pt-2 opacity-50 px-3">
              <div className="w-full h-20 bg-gray-100 rounded mb-2" />
              <div className="w-2/3 h-3 bg-gray-100 rounded" />
            </div>
          </div>
        )}
      </div>

      {/* Helper Footer */}
      <div className="p-2 text-center border-t border-dashed border-foreground/20 bg-background-editorial">
        <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          Preview represents standard resolution
        </p>
      </div>
    </div>
  );
}
