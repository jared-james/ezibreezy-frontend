// components/post-editor/previews/tiktok/tiktok-options.tsx

"use client";

import { useState } from "react";
import { Settings, Film } from "lucide-react";

interface TikTokOptionsProps {
  videoCoverTimestamp: number | null;
  onVideoCoverTimestampChange: (timestamp: number | null) => void;
  displayMediaSrc?: string;
  videoDuration: number;
}

export function TikTokOptions({
  videoCoverTimestamp,
  onVideoCoverTimestampChange,
  displayMediaSrc,
  videoDuration,
}: TikTokOptionsProps) {
  const [localVideoDuration, setLocalVideoDuration] = useState(videoDuration);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeSeconds = parseFloat(e.target.value);
    onVideoCoverTimestampChange(Math.floor(timeSeconds * 1000));
  };

  const handleVideoMetadataLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setLocalVideoDuration(e.currentTarget.duration);
  };

  const effectiveDuration = localVideoDuration || videoDuration;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-5 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-bold text-foreground flex items-center gap-2">
          <Settings className="w-4 h-4" />
          TikTok Settings
        </h3>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5" />
          Video Cover
        </label>

        <div className="flex gap-4 items-start">
          <div className="relative w-20 aspect-9/16 bg-muted border border-border rounded-md overflow-hidden shrink-0 flex items-center justify-center">
            {displayMediaSrc ? (
              <video
                src={displayMediaSrc}
                className="w-full h-full object-cover"
                muted
                playsInline
                onLoadedMetadata={handleVideoMetadataLoaded}
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
              <span className="text-[10px] text-muted-foreground">Auto</span>
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
                {effectiveDuration > 0 && ` / ${effectiveDuration.toFixed(1)}s`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={effectiveDuration > 0 ? effectiveDuration : 100}
              step={0.1}
              value={videoCoverTimestamp ? videoCoverTimestamp / 1000 : 0}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-primary"
              disabled={effectiveDuration === 0}
            />
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {effectiveDuration === 0
                ? "Loading video..."
                : "Select which frame of your video to use as the cover image"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
