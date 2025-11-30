// components/post-editor/caption/components/platform-filter-buttons.tsx

import { cn } from "@/lib/utils";
import { Platform } from "@/lib/types/editorial";
import { PlatformIcon } from "./platform-icon";

interface PlatformFilterButtonsProps {
  selectedPlatformIds: string[];
  platforms: Platform[];
  activeCaptionFilter: string;
  onFilterChange: (filter: string) => void;
}

export function PlatformFilterButtons({
  selectedPlatformIds,
  platforms,
  activeCaptionFilter,
  onFilterChange,
}: PlatformFilterButtonsProps) {
  if (selectedPlatformIds.length <= 1) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onFilterChange("all")}
        className={cn(
          "flex items-center justify-center rounded-full px-6 h-12 text-base font-medium transition-all",
          activeCaptionFilter === "all"
            ? "border-2 border-brand-primary bg-surface text-brand-primary"
            : "border border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
        )}
      >
        All
      </button>
      {selectedPlatformIds.map((platformId) => {
        const platform = platforms.find((p) => p.id === platformId);
        if (!platform) return null;

        const isActive = activeCaptionFilter === platformId;

        return (
          <button
            key={platformId}
            type="button"
            onClick={() => onFilterChange(platformId)}
            title={platform.name}
            className={cn(
              "flex items-center justify-center rounded-full border-2 h-12 w-12 transition-all",
              isActive
                ? "border-brand-primary bg-surface"
                : "border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            )}
          >
            <PlatformIcon
              platformId={platformId}
              className={cn(
                "h-6 w-6",
                isActive ? "text-brand-primary" : "text-current"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
