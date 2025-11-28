// app/(marketing)/tools/linkedin-text-formatter/components/post-preview.tsx

import { useState } from "react";
import {
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  Globe,
} from "lucide-react";

interface PostPreviewProps {
  content: string;
  formattedContent: string;
}

export function PostPreview({ content, formattedContent }: PostPreviewProps) {
  // If no content, show placeholder text
  const displayContent =
    formattedContent ||
    content ||
    "Write something in the input box to see how it looks on the feed...";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-dashed border-foreground/30 bg-background-editorial p-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold">LinkedIn Preview</h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          Feed Simulation
        </span>
      </div>

      {/* Display Area */}
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-auto bg-surface-hover/30">
        <div className="w-full max-w-[500px] bg-white border border-gray-200 shadow-sm rounded-lg animate-in fade-in zoom-in-95 duration-300">
          {/* Post Header */}
          <div className="p-3 flex gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-primary/20 to-brand-primary/40 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">
                    Your Name
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    Digital Creator • Building tools for creators
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <span>2h • </span>
                    <Globe className="w-3 h-3" />
                  </div>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Post Body */}
          <div className="px-4 pb-2 text-sm text-gray-900 whitespace-pre-wrap leading-relaxed font-sans">
            {displayContent}
          </div>

          {/* Hashtags Mockup */}
          <div className="px-4 pb-4 text-sm text-brand-primary font-bold">
            #growth #creatoreconomy
          </div>

          {/* Engagement Counts */}
          <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <ThumbsUp
                    className="w-2 h-2 text-white"
                    fill="currentColor"
                  />
                </div>
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white">
                  ❤️
                </div>
              </div>
              <span>1,245</span>
            </div>
            <div className="flex gap-2">
              <span>84 comments</span>
              <span>•</span>
              <span>12 reposts</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="px-2 py-1 border-t border-gray-100 flex justify-between">
            <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-100 rounded-md transition-colors flex-1 justify-center group">
              <ThumbsUp className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700">
                Like
              </span>
            </button>
            <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-100 rounded-md transition-colors flex-1 justify-center group">
              <MessageSquare className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700">
                Comment
              </span>
            </button>
            <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-100 rounded-md transition-colors flex-1 justify-center group">
              <Share2 className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700">
                Repost
              </span>
            </button>
            <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-100 rounded-md transition-colors flex-1 justify-center group">
              <Send className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700">
                Send
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Helper Footer */}
      <div className="p-2 text-center border-t border-dashed border-foreground/20 bg-background-editorial">
        <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          Not affiliated with LinkedIn Corp.
        </p>
      </div>
    </div>
  );
}
