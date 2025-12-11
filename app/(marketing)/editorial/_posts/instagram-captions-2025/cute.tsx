// app/(marketing)/editorial/_posts/instagram-captions-2025/cute.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Angel energy.",
  "Blooming.",
  "Cloud 9.",
  "Collecting smiles.",
  "Cute aggression.",
  "Feeling floaty.",
  "Heart full.",
  "Honey & lemon.",
  "Just happy to be here.",
  "Keep it sweet.",
  "Life is sweet.",
  "Love this for me.",
  "Pocket full of sunshine.",
  "Small moments.",
  "Soft era.",
  "Sparkle season.",
  "Sprinkling kindness.",
  "Sugar rush.",
  "Sunshine state of mind.",
  "Sweet life.",

  // NEW ADDITIONS
  "A little joy goes a long way.",
  "Butterfly feelings.",
  "Cherry-on-top energy.",
  "Cutest version of me today.",
  "Easy smiles.",
  "Feeling fizzy.",
  "Flower breath.",
  "Good mood activated.",
  "Heart doing tiny cartwheels.",
  "Here for the happy moments.",
  "Little joys only.",
  "Made of sunshine.",
  "Overflowing with soft vibes.",
  "Pure serotonin.",
  "Soft hearts club.",
  "Starry-eyed.",
  "Sweeter than yesterday.",
  "The gentle life.",
  "Tiny joys everywhere.",
  "Too cute to care.",
];

export default function CuteCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">03.</span> Cute Instagram Captions
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        Wholesome energy for when the vibe is just... sweet.
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
