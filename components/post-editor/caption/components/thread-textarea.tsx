// components/post-editor/caption/components/thread-textarea.tsx

import { Hash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ThreadTextareaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  threadIndex: number;
  onHashtagClick: (threadIndex: number) => void;
}

export function ThreadTextarea({
  value,
  onChange,
  placeholder,
  threadIndex,
  onHashtagClick,
}: ThreadTextareaProps) {
  return (
    <div className="relative">
      <Textarea
        rows={4}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-h-24 pr-10"
      />
      <button
        type="button"
        onClick={() => onHashtagClick(threadIndex)}
        className="absolute bottom-3 right-3 text-muted-foreground hover:text-brand-primary transition-colors"
      >
        <Hash className="h-4 w-4" />
      </button>
    </div>
  );
}
