// app/(marketing)/tools/social-image-resizer/components/controls/format-selector.tsx

import { cn } from "@/lib/utils";
import { SOCIAL_FORMATS } from "../../constants";

interface FormatSelectorProps {
  activeFormatId: string;
  onSelect: (id: string) => void;
}

export function FormatSelector({
  activeFormatId,
  onSelect,
}: FormatSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SOCIAL_FORMATS.map((format) => {
        const Icon = format.icon;
        const isActive = activeFormatId === format.id;

        return (
          <button
            key={format.id}
            onClick={() => onSelect(format.id)}
            className={cn(
              "group relative flex items-start gap-3 p-3 border text-left transition-all duration-200",
              isActive
                ? "bg-foreground text-background-editorial border-foreground shadow-md"
                : "bg-white border-foreground/10 hover:border-foreground/30 hover:bg-surface-hover"
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-md shrink-0 transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "bg-foreground/5 text-foreground/60"
              )}
            >
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex flex-col min-w-0">
              <span
                className={cn(
                  "text-xs font-bold leading-tight",
                  isActive ? "text-white" : "text-foreground"
                )}
              >
                {format.label}
              </span>
              <span
                className={cn(
                  "text-[9px] font-mono mt-1 opacity-70",
                  isActive ? "text-white/80" : "text-foreground/50"
                )}
              >
                {format.platform}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
