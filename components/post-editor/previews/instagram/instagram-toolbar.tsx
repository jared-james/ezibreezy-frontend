// components/post-editor/previews/instagram/instagram-toolbar.tsx

import { cn } from "@/lib/utils";
import { Square, Grid3X3, Crop, UserPlus, Loader2, FileText, ShoppingBag } from "lucide-react";

interface InstagramToolbarProps {
  viewMode: "post" | "grid";
  onViewModeChange: (mode: "post" | "grid") => void;
  canCrop: boolean;
  onCropClick: () => void;
  isFetchingOriginal: boolean;
  isTaggingSupported: boolean;
  isTaggingMode: boolean;
  onToggleTagging: () => void;
  isProductTaggingSupported?: boolean;
  isProductTaggingMode?: boolean;
  onToggleProductTagging?: () => void;
  displayMediaSrc?: string;
  isStory: boolean;
  canEditAltText?: boolean;
  onAltTextClick?: () => void;
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
  isProductTaggingSupported = false,
  isProductTaggingMode = false,
  onToggleProductTagging,
  displayMediaSrc,
  isStory,
  canEditAltText = false,
  onAltTextClick,
}: InstagramToolbarProps) {
  if (!displayMediaSrc) {
    return (
      <p className="text-xs text-muted-foreground italic text-center">
        Instagram Preview
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* View Switcher - First Line */}
      {!isStory && (
        <>
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
              View Post
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
              View Grid
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />
        </>
      )}

      {/* Action Buttons - Second Line */}
      <div className="flex items-center gap-4">

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

      {/* Product Tag Button */}
      {isProductTaggingSupported && onToggleProductTagging && (
        <button
          onClick={() => {
            if (viewMode === "grid") return;
            onToggleProductTagging();
          }}
          title={
            viewMode === "grid"
              ? "Switch to Post view to tag products"
              : isProductTaggingMode
              ? "Done Tagging Products"
              : "Tag Products"
          }
          disabled={viewMode === "grid"}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            viewMode === "grid"
              ? "text-muted-foreground/40 cursor-not-allowed"
              : isProductTaggingMode
              ? "text-brand-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {isProductTaggingMode ? "Done" : "Products"}
        </button>
      )}

      {/* Alt Text Button */}
      {canEditAltText && onAltTextClick && (
        <button
          onClick={onAltTextClick}
          title="Edit Alt Text"
          disabled={viewMode === "grid"}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            viewMode === "grid"
              ? "text-muted-foreground/40 cursor-not-allowed"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="h-3.5 w-3.5" />
          Alt
        </button>
      )}
      </div>
    </div>
  );
}
