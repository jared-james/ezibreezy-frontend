// components/post-editor/caption/components/post-type-selector.tsx

import { Book, Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostTypeSelectorProps {
  currentType: "post" | "story" | "reel";
  onTypeChange: (type: "post" | "story" | "reel") => void;
}

export function PostTypeSelector({
  currentType,
  onTypeChange,
}: PostTypeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onTypeChange("post")}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          currentType === "post"
            ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
            : "border-border bg-transparent text-muted-foreground hover:bg-surface-hover"
        )}
      >
        <Book className="h-3 w-3" />
        Post
      </button>
      <button
        type="button"
        onClick={() => onTypeChange("story")}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          currentType === "story"
            ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
            : "border-border bg-transparent text-muted-foreground hover:bg-surface-hover"
        )}
      >
        <Clapperboard className="h-3 w-3" />
        Story
      </button>
    </div>
  );
}
