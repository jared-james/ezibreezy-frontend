// app/(marketing)/editorial/_posts/instagram-captions-2025/couples.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Always.",
  "Better together.",
  "Best friend.",
  "Date night details.",
  "Everything.",
  "Found my lobster.",
  "Home.",
  "Just us.",
  "Life with you.",
  "Love language.",
  "Lucky me.",
  "Making memories.",
  "My favorite notification.",
  "My person.",
  "Partner in crime.",
  "Ride or die.",
  "Sunday kind of love.",
  "Team.",
  "Two of a kind.",
  "Us against the world.",

  // NEW ADDITIONS
  "All in.",
  "As long as it's you.",
  "Chosen.",
  "Daily gratitude.",
  "For keeps.",
  "Heart full.",
  "Here's to us.",
  "Hold my hand.",
  "In this together.",
  "It's always been you.",
  "Keeping the magic.",
  "Love looks good on us.",
  "My safe place.",
  "No better company.",
  "Our little world.",
  "Still us.",
  "The best part of my day.",
  "This feels like home.",
  "With you, always.",
  "You + me.",
];

export default function CouplesCaptions() {
  return (
    <div className="my-12">
      {/* EXACT KEYWORD MATCH */}
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">05.</span> Instagram Captions for
        Couples
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        Celebrating your person without the cringe.
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
