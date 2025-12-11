// app/(marketing)/editorial/_posts/instagram-captions-2025/nature.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Breathe it in.",
  "Chasing light.",
  "Disconnect to reconnect.",
  "Earth tones.",
  "Fresh air.",
  "Golden hour.",
  "Grounded.",
  "Into the wild.",
  "Mother Earth.",
  "Natural palette.",
  "Nature heals.",
  "Peace of mind.",
  "Quiet moments.",
  "Serenity.",
  "Sky gazing.",
  "Slow down.",
  "Sun-kissed.",
  "Views.",
  "Vitamin D.",
  "Wild and free.",

  // NEW ADDITIONS
  "Among the trees.",
  "Blue skies ahead.",
  "Chasing horizons.",
  "Earth-side living.",
  "Fields of quiet.",
  "Golden hour glow.",
  "Here for the sunshine.",
  "In the stillness.",
  "Let the light in.",
  "Lost in the landscape.",
  "Nature therapy.",
  "Out where it’s quiet.",
  "Outside is my happy place.",
  "Roots and rainbows.",
  "Salt in the air.",
  "Soft skies.",
  "Sunset season.",
  "The world feels softer here.",
  "Touched by the sun.",
  "Where the wild things grow.",
];

export default function NatureCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">21.</span> Nature & Sunsets
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        For the golden hour shots and outdoor escapes.
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
