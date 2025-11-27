"use client";

import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";

export function ThreadsPostFooter() {
  return (
    <div className="mt-3 flex items-center gap-4 text-foreground">
      <Heart className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors" />
      <MessageCircle className="h-5 w-5 cursor-pointer hover:text-foreground/80 transition-colors" />
      <Repeat2 className="h-5 w-5 cursor-pointer hover:text-foreground/80 transition-colors" />
      <Send className="h-5 w-5 cursor-pointer hover:text-foreground/80 transition-colors" />
    </div>
  );
}
