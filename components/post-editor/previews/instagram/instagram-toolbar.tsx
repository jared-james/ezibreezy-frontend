// components/post-editor/previews/instagram/instagram-toolbar.tsx

import { cn } from "@/lib/utils";
import { Crop, UserPlus, FileText, ShoppingBag, Loader2 } from "lucide-react";

interface InstagramToolbarProps {
  viewMode: "post" | "grid";
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
  canEditAltText?: boolean;
  onAltTextClick?: () => void;
}

export function InstagramToolbar({
  viewMode,
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
  canEditAltText = false,
  onAltTextClick,
}: InstagramToolbarProps) {
  if (!displayMediaSrc || viewMode === "grid") return null;

  const btnClass =
    "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors hover:bg-muted focus:bg-muted text-muted-foreground hover:text-foreground";
  const activeBtnClass =
    "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 hover:text-brand-primary";

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-surface border-t border-border">
      {canCrop && (
        <button
          onClick={onCropClick}
          disabled={isFetchingOriginal}
          className={cn(btnClass)}
          title="Crop Media"
        >
          {isFetchingOriginal ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Crop className="h-3.5 w-3.5" />
          )}
          <span>Crop</span>
        </button>
      )}

      {isTaggingSupported && (
        <button
          onClick={onToggleTagging}
          className={cn(btnClass, isTaggingMode && activeBtnClass)}
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>{isTaggingMode ? "Done Tagging" : "Tag"}</span>
        </button>
      )}

      {isProductTaggingSupported && onToggleProductTagging && (
        <button
          onClick={onToggleProductTagging}
          className={cn(btnClass, isProductTaggingMode && activeBtnClass)}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>{isProductTaggingMode ? "Done Tagging" : "Products"}</span>
        </button>
      )}

      {canEditAltText && onAltTextClick && (
        <button onClick={onAltTextClick} className={cn(btnClass)}>
          <FileText className="h-3.5 w-3.5" />
          <span>Alt Text</span>
        </button>
      )}
    </div>
  );
}
