// components/post-editor/previews/linkedin/linkedin-post-footer.tsx

"use client";

import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
} from "lucide-react";

export function LinkedInPostFooter() {
  return (
    <div className="flex items-center justify-around py-2 text-[--muted-foreground] border-t border-[--border]">
      <button className="flex items-center justify-center p-2 hover:bg-[--surface-hover] rounded">
        <ThumbsUp className="w-5 h-5" />
      </button>
      <button className="flex items-center justify-center p-2 hover:bg-[--surface-hover] rounded">
        <MessageSquare className="w-5 h-5" />
      </button>
      <button className="flex items-center justify-center p-2 hover:bg-[--surface-hover] rounded">
        <Repeat2 className="w-5 h-5" />
      </button>
      <button className="flex items-center justify-center p-2 hover:bg-[--surface-hover] rounded">
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
