// components/post-editor/previews/tiktok/tiktok-video-options.tsx

import { Film } from "lucide-react";

interface TikTokVideoOptionsProps {
  displayMediaSrc?: string;
  videoCoverTimestamp?: number | null;
  onVideoCoverTimestampChange?: (timestamp: number | null) => void;
  videoDuration: number;
}

export function TikTokVideoOptions({
  displayMediaSrc,
  videoCoverTimestamp,
  onVideoCoverTimestampChange,
  videoDuration,
}: TikTokVideoOptionsProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeSeconds = parseFloat(e.target.value);
    onVideoCoverTimestampChange?.(Math.floor(timeSeconds * 1000));
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-5 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-bold text-foreground flex items-center gap-2">
          <Film className="w-4 h-4" />
          Video Options
        </h3>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Cover Frame
        </label>

        <div className="flex gap-4 items-start">
          <div className="relative w-20 aspect-9/16 bg-muted border border-border rounded-md overflow-hidden shrink-0">
            {displayMediaSrc ? (
              <video
                src={displayMediaSrc}
                className="w-full h-full object-cover"
                muted
                playsInline
                ref={(el) => {
                  if (
                    el &&
                    videoCoverTimestamp !== undefined &&
                    videoCoverTimestamp !== null
                  ) {
                    el.currentTime = videoCoverTimestamp / 1000;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-[10px] text-center p-1">
                <span>Auto</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Select Frame</span>
              <span>
                {videoCoverTimestamp
                  ? (videoCoverTimestamp / 1000).toFixed(1)
                  : "0.0"}
                s
                {videoDuration > 0 && ` / ${videoDuration.toFixed(1)}s`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={videoDuration > 0 ? videoDuration : 100}
              step={0.1}
              value={videoCoverTimestamp ? videoCoverTimestamp / 1000 : 0}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-primary"
              disabled={videoDuration === 0}
            />
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {videoDuration === 0
                ? "Loading video..."
                : "Select which frame of your video to use as the cover image"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
