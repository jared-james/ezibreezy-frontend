// components/post-editor/previews/instagram/instagram-grid-view.tsx

import { ImageIcon } from "lucide-react";

interface InstagramGridViewProps {
  displayMediaSrc?: string;
  mediaType: "image" | "video" | "text";
  coverUrl?: string | null;
  thumbOffset?: number | null;
}

export function InstagramGridView({
  displayMediaSrc,
  mediaType,
  coverUrl,
  thumbOffset,
}: InstagramGridViewProps) {
  return (
    <div className="bg-background p-2">
      <div className="grid grid-cols-3 gap-0.5">
        {[0, 1, 2].map((i) => (
          <div key={`top-${i}`} className="aspect-3/4 bg-muted" />
        ))}
        <div className="aspect-3/4 bg-muted" />

        {/* The Active Post Preview */}
        <div className="aspect-3/4 relative overflow-hidden ring-2 ring-primary">
          {displayMediaSrc ? (
            mediaType === "video" ? (
              coverUrl ? (
                <img
                  src={coverUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={displayMediaSrc}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  ref={(el) => {
                    if (el && thumbOffset) {
                      el.currentTime = thumbOffset / 1000;
                    }
                  }}
                />
              )
            ) : (
              <img
                src={displayMediaSrc}
                alt="Grid Preview"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="aspect-3/4 bg-muted" />
        {[0, 1, 2].map((i) => (
          <div key={`bottom-${i}`} className="aspect-3/4 bg-muted" />
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Grid preview (3:4 crop)
      </p>
    </div>
  );
}
