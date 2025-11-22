// components/post-editor/render-caption.tsx

import React from "react";

export function renderCaptionWithHashtags(text: string): React.ReactNode {
  if (!text) return text;

  const hashtagRegex = /(#\w+)/g;
  const parts = text.split(hashtagRegex);

  return parts.map((part, index) => {
    if (part.match(hashtagRegex)) {
      return (
        <span key={index} className="text-[#1d9bf0]">
          {part}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
