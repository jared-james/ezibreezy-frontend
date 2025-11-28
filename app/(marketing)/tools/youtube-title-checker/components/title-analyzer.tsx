// app/(marketing)/tools/youtube-title-checker/components/title-analyzer.tsx

import { useRef, useMemo } from "react";
import {
  Upload,
  ImageIcon,
  Type,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TitleAnalyzerProps {
  title: string;
  onTitleChange: (val: string) => void;
  thumbnail: string | null;
  onThumbnailChange: (val: string | null) => void;
}

export function TitleAnalyzer({
  title,
  onTitleChange,
  thumbnail,
  onThumbnailChange,
}: TitleAnalyzerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onThumbnailChange(URL.createObjectURL(file));
    }
  };

  // --- Scoring Logic ---
  const stats = useMemo(() => {
    const chars = title.length;
    // Optimal length is roughly 20-60 characters
    let score = 0;
    let message = "Waiting for input...";
    let status: "neutral" | "good" | "warning" | "error" = "neutral";

    if (chars === 0) {
      score = 0;
    } else if (chars < 20) {
      score = 40;
      message = "Too short. Add more context.";
      status = "warning";
    } else if (chars >= 20 && chars <= 50) {
      score = 100;
      message = "Optimal length.";
      status = "good";
    } else if (chars > 50 && chars <= 60) {
      score = 90;
      message = "Approaching truncation limit.";
      status = "warning";
    } else {
      score = Math.max(0, 90 - (chars - 60) * 2);
      message = "Title will be truncated on most devices.";
      status = "error";
    }

    return { chars, score, message, status };
  }, [title]);

  return (
    <div className="space-y-8">
      {/* --- Input Section --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-foreground/50">
          <label className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
            <Type className="w-3 h-3" />
            Video Title
          </label>
          <span
            className={cn(
              "font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
              stats.status === "error"
                ? "bg-red-100 text-red-600"
                : stats.status === "good"
                ? "bg-green-100 text-green-600"
                : "bg-foreground/10"
            )}
          >
            {stats.chars} / 100
          </span>
        </div>

        <textarea
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter your compelling video title here..."
          className="w-full h-32 p-4 bg-white border-2 border-dashed border-foreground/30 focus:border-brand-primary focus:outline-none font-serif text-xl md:text-2xl leading-tight resize-none transition-colors"
        />
      </div>

      {/* --- Score Gauge (Technical Slider Style) --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
            Impact Score
          </label>
          <span className="font-serif text-3xl font-bold leading-none">
            {stats.score}
          </span>
        </div>

        <div className="h-4 w-full bg-foreground/5 border border-foreground/10 relative overflow-hidden">
          {/* Background hatch pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 5px, #000 5px, #000 6px)",
            }}
          />

          {/* Progress Bar */}
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              stats.score > 80
                ? "bg-brand-primary"
                : stats.score > 50
                ? "bg-yellow-500"
                : "bg-red-500"
            )}
            style={{ width: `${stats.score}%` }}
          />
        </div>

        {/* Feedback Message */}
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide">
          {stats.status === "good" ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : stats.status === "neutral" ? null : (
            <AlertTriangle
              className={cn(
                "w-4 h-4",
                stats.status === "error" ? "text-red-500" : "text-yellow-500"
              )}
            />
          )}
          <span className="text-foreground/70">{stats.message}</span>
        </div>
      </div>

      {/* --- Thumbnail Upload (Mini) --- */}
      <div className="pt-6 border-t border-dashed border-foreground/20">
        <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-2 mb-4">
          <ImageIcon className="w-3 h-3" />
          Thumbnail Preview (Optional)
        </label>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative cursor-pointer w-full h-20 border border-dashed border-foreground/30 bg-white hover:bg-surface-hover hover:border-foreground/60 transition-all flex items-center gap-4 px-4 overflow-hidden"
        >
          <div className="w-12 h-12 bg-foreground/5 flex items-center justify-center shrink-0 border border-foreground/10">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Thumb"
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="w-5 h-5 text-foreground/40" />
            )}
          </div>

          <div className="flex-1">
            <p className="font-bold text-sm text-foreground group-hover:text-brand-primary transition-colors">
              {thumbnail ? "Replace Image" : "Upload Thumbnail"}
            </p>
            <p className="text-[10px] font-mono uppercase text-foreground/40">
              JPG, PNG • Max 2MB
            </p>
          </div>

          {/* Technical Corner */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-foreground/40" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-foreground/40" />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
