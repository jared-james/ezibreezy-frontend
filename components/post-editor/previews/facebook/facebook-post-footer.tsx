// components/post-editor/previews/facebook/facebook-post-footer.tsx

"use client";

import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

export function FacebookPostFooter() {
  return (
    <div className="flex items-center justify-around py-2 border-t border-[--border] text-[--muted-foreground]">
      <button className="flex items-center justify-center p-2 hover:bg-[--surface-hover] rounded">
        <ThumbsUp className="w-5 h-5" />
      </button>
      <button className="flex items-center justify-center p-2 hover:bg-[--surface-hover] rounded">
        <MessageCircle className="w-5 h-5" />
      </button>
      <button className="flex items-center justify-center p-2 hover:bg-[--surface-hover] rounded">
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}
