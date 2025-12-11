// app/(marketing)/editorial/_posts/instagram-captions-2025/sassy.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Applying pressure.",
  "Don't check for me unless you have a check for me.",
  "Exhale the bullshit.",
  "Excuse me while I succeed.",
  "High maintenance? No, high standards.",
  "I'm not for everyone.",
  "Know your worth, then add tax.",
  "Level up.",
  "Limited edition.",
  "Look but don't touch.",
  "Main character energy.",
  "Not searching, I'm attracting.",
  "Not your competition.",
  "Protecting my peace.",
  "Queen of my own world.",
  "Simply the best.",
  "Sorry, not sorry.",
  "Too busy watering my own grass.",
  "Unbothered.",
  "Your loss, babe.",

  // NEW ADDITIONS
  "A vibe you can’t replace.",
  "Already upgraded.",
  "Booked and unbothered.",
  "Can’t compete where you don’t compare.",
  "Classy with a side of savage.",
  "Confidence activated.",
  "Did it without asking.",
  "Don’t mistake my kindness for weakness.",
  "Glow different when you love yourself.",
  "I said what I said.",
  "I’m the standard.",
  "More self-love, less validation.",
  "No explanations needed.",
  "Out of your league respectfully.",
  "Raised the bar and left it there.",
  "Silence is my favorite clapback.",
  "Some things are better without me.",
  "Talk to me nicely.",
  "Too real to be replaced.",
  "What you see is earned.",
];

export default function SassyCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">16.</span> Sassy & Confident
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        For when you need to remind them who you are.
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
