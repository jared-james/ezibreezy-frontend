import { Hash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CaptionTextareaProps {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  platformId: string;
  onHashtagClick: (platformId: string) => void;
  disabled?: boolean;
  maxLength?: number;
  warningLimit?: number;
}

export function CaptionTextarea({
  id,
  value,
  onChange,
  placeholder,
  platformId,
  onHashtagClick,
  disabled,
  maxLength,
  warningLimit,
}: CaptionTextareaProps) {
  const currentLength = value.length;
  const isAtLimit = maxLength && currentLength >= maxLength;
  const isOverWarning = warningLimit && currentLength > warningLimit;
  const isNearLimit = maxLength && currentLength >= maxLength * 0.9;

  return (
    <div className="relative">
      <Textarea
        id={id}
        rows={10}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "min-h-32 pr-10 pb-8",
          isAtLimit
            ? "border-red-500 focus-visible:ring-red-500"
            : isOverWarning
            ? "border-amber-500 focus-visible:ring-amber-500"
            : ""
        )}
        disabled={disabled}
        maxLength={maxLength}
      />
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center pointer-events-none">
        <div
          className={cn(
            "text-xs transition-colors font-mono flex items-center gap-2",
            isAtLimit
              ? "text-red-500 font-bold"
              : isOverWarning
              ? "text-amber-500 font-medium"
              : isNearLimit
              ? "text-amber-500"
              : "text-muted-foreground"
          )}
        >
          {maxLength ? (
            <span>
              {currentLength.toLocaleString()} / {maxLength.toLocaleString()}
            </span>
          ) : (
            <span>{currentLength.toLocaleString()} chars</span>
          )}
          {isOverWarning && !isAtLimit && (
            <span className="text-[10px] uppercase tracking-wider font-bold border border-amber-500 px-1 rounded text-amber-500">
              Premium
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onHashtagClick(platformId)}
          className="pointer-events-auto text-muted-foreground hover:text-brand-primary transition-colors p-1"
          disabled={disabled}
        >
          <Hash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
