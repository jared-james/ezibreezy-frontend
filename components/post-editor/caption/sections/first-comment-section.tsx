// components/post-editor/caption/sections/first-comment-section.tsx

import { Plus, Trash2, Hash, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FirstCommentSectionProps {
  platformId: "instagram" | "facebook";
  showFirstComment: boolean;
  setShowFirstComment: (show: boolean) => void;
  firstComment: string;
  setFirstComment: (comment: string) => void;
  openHashtagModal: (platformId: string) => void;
  isStoryMode?: boolean;
  maxLength?: number;
}

export function FirstCommentSection({
  platformId,
  showFirstComment,
  setShowFirstComment,
  firstComment,
  setFirstComment,
  openHashtagModal,
  isStoryMode = false,
  maxLength,
}: FirstCommentSectionProps) {
  const hashtagModalId =
    platformId === "instagram"
      ? "instagram_first_comment"
      : "facebook_first_comment";

  const currentLength = firstComment.length;
  const isAtLimit = maxLength && currentLength >= maxLength;
  const isNearLimit = maxLength && currentLength >= maxLength * 0.9;

  if (!showFirstComment) {
    return (
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setShowFirstComment(true)}
          variant="ghost"
          size="sm"
          className="gap-1 text-xs text-muted-foreground hover:text-foreground"
          disabled={isStoryMode}
        >
          <Plus className="h-3 w-3" />
          Add first comment
        </Button>
      </div>
    );
  }

  return (
    <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border ml-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="eyebrow flex items-center gap-1.5 text-[0.65rem]">
            <MessageSquare className="h-3 w-3" />
            First Comment
          </p>
          <Button
            type="button"
            onClick={() => {
              setFirstComment("");
              setShowFirstComment(false);
            }}
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-muted-foreground hover:text-error"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        <div className="relative">
          <Textarea
            rows={4}
            value={firstComment}
            onChange={(e) => setFirstComment(e.target.value)}
            placeholder="Add your hashtags or opening line here..."
            className={cn(
              "min-h-24 pr-10 pb-7",
              isAtLimit && "border-red-500 focus-visible:ring-red-500"
            )}
            maxLength={maxLength}
          />

          <div className="absolute bottom-2 left-2 text-[10px] pointer-events-none font-mono">
            {maxLength && (
              <span
                className={cn(
                  "transition-colors",
                  isNearLimit ? "text-amber-500" : "text-muted-foreground",
                  isAtLimit && "text-red-500 font-bold"
                )}
              >
                {currentLength.toLocaleString()} / {maxLength.toLocaleString()}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => openHashtagModal(hashtagModalId)}
            className="absolute bottom-3 right-3 text-muted-foreground hover:text-brand-primary transition-colors"
          >
            <Hash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
