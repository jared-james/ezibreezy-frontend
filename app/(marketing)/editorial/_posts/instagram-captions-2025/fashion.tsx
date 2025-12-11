// app/(marketing)/editorial/_posts/instagram-captions-2025/fashion.tsx

"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Closet rotation.",
  "Comfort first.",
  "Details.",
  "Dressed up.",
  "Effortless.",
  "Fit check.",
  "Layers.",
  "Minimalist wardrobe.",
  "Mood in fabric form.",
  "Neutral palette.",
  "Outfit repeater.",
  "Statement piece.",
  "Street style.",
  "Style is personal.",
  "Texture.",
  "The uniform.",
  "Today's look.",
  "Uniform of the day.",
  "Vintage finds.",
  "Wear what makes you happy.",

  // NEW ADDITIONS
  "All in the styling.",
  "Clean lines only.",
  "Current rotation.",
  "Draped in confidence.",
  "Everyday essentials.",
  "Fabric speaks.",
  "Monochrome moment.",
  "OOTD agenda.",
  "Quiet luxury energy.",
  "Sharp tailoring.",
  "Silhouette study.",
  "Simple but significant.",
  "Styled with intention.",
  "That effortless thing.",
  "The fit chose me.",
  "Thread therapy.",
  "Timeless over trendy.",
  "Today’s uniform.",
  "Wardrobe in motion.",
  "Well-worn favorites.",
];

export default function FashionCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">19.</span> Fashion & OOTD
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        When the outfit is the main character.
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
