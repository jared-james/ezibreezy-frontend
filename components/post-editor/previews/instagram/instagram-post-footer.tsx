// components/post-editor/previews/instagram/instagram-post-footer.tsx

import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { renderCaptionWithHashtags } from "../../render-caption";

interface InstagramPostFooterProps {
  primaryName: string;
  caption: string;
  collaborators?: string;
}

export function InstagramPostFooter({
  primaryName,
  caption,
  collaborators,
}: InstagramPostFooterProps) {
  return (
    <>
      <div className="flex justify-between p-3">
        <div className="flex items-center gap-4 text-muted-foreground">
          <Heart className="size-6 hover:text-foreground cursor-pointer" />
          <MessageCircle className="size-6 hover:text-foreground cursor-pointer" />
          <Send className="size-6 hover:text-foreground cursor-pointer" />
        </div>
        <Bookmark className="size-6 text-muted-foreground hover:text-foreground cursor-pointer" />
      </div>

      <div className="px-3 pb-4 space-y-2">
        <p className="text-xs font-semibold text-foreground">0 likes</p>

        <div className="text-sm">
          <span className="font-semibold mr-1">{primaryName}</span>
          <span className="whitespace-pre-wrap">
            {renderCaptionWithHashtags(caption)}
          </span>
        </div>

        {collaborators && (
          <p className="text-xs text-brand-primary">
            With <span className="font-semibold">{collaborators}</span>
          </p>
        )}
      </div>
    </>
  );
}
