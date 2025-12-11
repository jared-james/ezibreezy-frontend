// app/(marketing)/editorial/_posts/instagram-captions-2025/selfie.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Be the reason someone smiles today.",
  "Be your own muse.",
  "Confidence level: Insta selfie.”",
  "Confidence looks good on you.",
  "Face card valid.",
  "Focus on you.",
  "Golden hour glow.",
  "Happier than ever.",
  "Just another day being awesome.",
  "Just me.",
  "Main character energy.",
  "Me, myself, and I.",
  "Not your average.",
  "Note to self.",
  "Own who you are.",
  "Personal collection.",
  "Proof of life.",
  "Self-love is the best love.",
  "Self-portrait.",
  "Smiling because I can.",
  "Sunday best.",
  "Unfiltered.",
  "Vibe check.",
  "Won't delete later.",

  // NEW ADDITIONS
  "A little light, a little magic.",
  "All angles approved.",
  "As real as it gets.",
  "Caught myself smiling.",
  "Currently glowing.",
  "Doing me, always.",
  "Feeling myself today.",
  "Found my light.",
  "Hello, it’s me.",
  "In my best era.",
  "Just showing up.",
  "Keeping it cute.",
  "Living in my softness.",
  "Made you look.",
  "More of this energy.",
  "Owned it.",
  "Serving face.",
  "Soft selfie moment.",
  "This is me—unfiltered.",
  "The vibe is me.",
];

export default function SelfieCaptions() {
  return (
    <div className="my-12">
      {/* EXACT KEYWORD MATCH */}
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">04.</span> Instagram Captions for
        Selfies
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        For the personal brand. Confident, not arrogant.
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
