// components/post-editor/caption/components/caption-textarea.tsx

import { Hash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CaptionTextareaProps {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  platformId: string;
  onHashtagClick: (platformId: string) => void;
  disabled?: boolean;
}

export function CaptionTextarea({
  id,
  value,
  onChange,
  placeholder,
  platformId,
  onHashtagClick,
  disabled,
}: CaptionTextareaProps) {
  return (
    <div className="relative">
      <Textarea
        id={id}
        rows={10}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-h-32 pr-10"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => onHashtagClick(platformId)}
        className="absolute bottom-3 right-3 text-muted-foreground hover:text-brand-primary transition-colors"
        disabled={disabled}
      >
        <Hash className="h-4 w-4" />
      </button>
    </div>
  );
}
