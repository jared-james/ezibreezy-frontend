// app/(app)/editorial/components/render-caption.tsx

import React from "react";

/**
 * Parses text and renders hashtags in blue color
 * Matches hashtags starting with # followed by alphanumeric characters and underscores
 */
export function renderCaptionWithHashtags(text: string): React.ReactNode {
  if (!text) return text;

  // Regular expression to match hashtags
  // Matches # followed by one or more word characters (letters, numbers, underscores)
  const hashtagRegex = /(#\w+)/g;

  const parts = text.split(hashtagRegex);

  return parts.map((part, index) => {
    // Check if this part is a hashtag
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
