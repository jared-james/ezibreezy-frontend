// app/(marketing)/editorial/_posts/instagram-captions-2025/stories.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
const captions = [
  "AMA 👇",
  "Ask me anything.",
  "Coffee run.",
  "Current mood.",
  "Desk situation.",
  "Thoughts?",
  "Happening now.",
  "Help me choose.",
  "Just landed.",
  "Link sticker.",
  "Missed this?",
  "Morning routine.",
  "New post.",
  "Outfit details.",
  "Q&A.",
  "Swipe up.",
  "Tap to read.",
  "Unboxing time.",
  "Vote below.",
  "Yes or No?",

  // NEW ADDITIONS
  "Add to cart?",
  "Ask away.",
  "Be right back.",
  "Behind today’s chaos.",
  "Drop a question.",
  "Drop your vote.",
  "Guess where?",
  "Here’s the update.",
  "Hot take?",
  "In case you missed it.",
  "Little life update.",
  "Mini moment.",
  "Mood of the day.",
  "Need your opinion.",
  "New drop.",
  "Next slide.",
  "Quick check-in.",
  "Today’s agenda.",
  "Try this.",
  "What do you think?",
];

export default function StoryCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">07.</span> Instagram Story Captions
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        Short, interactive text for your daily updates.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {captions.map((caption, i) => (
          <CaptionCard key={i} text={caption} />
        ))}
      </div>
    </div>
  );
}

function CaptionCard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={copyToClipboard}
      className="group relative p-4 border border-foreground/10 bg-surface/50 hover:bg-surface-hover hover:border-brand-primary/50 transition-all cursor-pointer rounded-sm"
    >
      <p className="font-mono text-sm md:text-base pr-8">{text}</p>
      <div className="absolute top-4 right-4 text-foreground/40 group-hover:text-brand-primary transition-colors">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </div>
    </div>
  );
}
