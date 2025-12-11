// app/(marketing)/editorial/_posts/instagram-captions-2025/winter-2025.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "2025 Vision.",
  "Cold days, warm mindset.",
  "Cold hands, warm heart.",
  "Cozy season.",
  "Entering my quiet era.",
  "First page of the next chapter.",
  "Focus year.",
  "Fresh start.",
  "Hibernation mode: On.",
  "January blues (the good kind).",
  "January dump.",
  "Loading...",
  "Manifesting...",
  "New era.",
  "New year, same drive.",
  "Page 1 of 365.",
  "Season of change.",
  "Setting the tone.",
  "Winter aesthetics.",
  "Winter arc.",

  // NEW ADDITIONS
  "A softer start.",
  "Beginning again.",
  "Blank page energy.",
  "Breathing room.",
  "Chapter 2025.",
  "Cozy reboot.",
  "Early year clarity.",
  "Embracing the slow season.",
  "Fresh chapter loading.",
  "Frosty mornings, warm intentions.",
  "Grounding into the new year.",
  "New chapters feel like this.",
  "Quiet beginnings.",
  "Reset season.",
  "Soft goals only.",
  "Stepping into stillness.",
  "The year starts now.",
  "Warm lights, cold nights.",
  "Winter reset.",
  "Wishing season.",
];

export default function Winter2025Captions() {
  return (
    <div className="my-12">
      {/* EXACT KEYWORD MATCH */}
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">11.</span> Best Instagram Captions
        2025
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        Capturing the reset. Fresh starts and cozy winter vibes.
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
