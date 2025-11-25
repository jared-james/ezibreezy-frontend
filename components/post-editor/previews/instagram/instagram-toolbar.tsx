// components/post-editor/previews/instagram/instagram-toolbar.tsx

import { cn } from "@/lib/utils";
import { Square, Grid3X3, Crop, UserPlus, Loader2 } from "lucide-react";

interface InstagramToolbarProps {
  viewMode: "post" | "grid";
  onViewModeChange: (mode: "post" | "grid") => void;
  canCrop: boolean;
  onCropClick: () => void;
  isFetchingOriginal: boolean;
  isTaggingSupported: boolean;
  isTaggingMode: boolean;
  onToggleTagging: () => void;
  displayMediaSrc?: string;
  isStory: boolean;
}

export function InstagramToolbar({
  viewMode,
  onViewModeChange,
  canCrop,
  onCropClick,
  isFetchingOriginal,
  isTaggingSupported,
  isTaggingMode,
  onToggleTagging,
  displayMediaSrc,
  isStory,
}: InstagramToolbarProps) {
  if (!displayMediaSrc) {
    return (
      <p className="text-xs text-muted-foreground italic text-center">
        Instagram Preview
      </p>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* View Switcher */}
      {!isStory && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewModeChange("post")}
            title="Post View"
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium transition-colors",
              viewMode === "post"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Square className="h-3.5 w-3.5" />
            Post
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            title="Grid View"
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium transition-colors",
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            Grid
          </button>
        </div>
      )}

      {/* Divider */}
      {!isStory && (canCrop || isTaggingSupported) && (
        <div className="h-4 w-px bg-border" />
      )}

      {/* Crop Button */}
      {canCrop && (
        <button
          onClick={onCropClick}
          title="Crop Image"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          disabled={isFetchingOriginal}
        >
          {isFetchingOriginal ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Crop className="h-3.5 w-3.5" />
          )}
          Crop
        </button>
      )}

      {/* Tag Button */}
      {isTaggingSupported && (
        <button
          onClick={() => {
            if (viewMode === "grid") return;
            onToggleTagging();
          }}
          title={
            viewMode === "grid"
              ? "Switch to Post view to tag"
              : isTaggingMode
              ? "Done Tagging"
              : "Tag People"
          }
          disabled={viewMode === "grid"}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            viewMode === "grid"
              ? "text-muted-foreground/40 cursor-not-allowed"
              : isTaggingMode
              ? "text-brand-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <UserPlus className="h-3.5 w-3.5" />
          {isTaggingMode ? "Done" : "Tag"}
        </button>
      )}
    </div>
  );
}
