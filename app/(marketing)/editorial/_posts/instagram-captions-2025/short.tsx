// app/(marketing)/editorial/_posts/instagram-captions-2025/short.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Archives.",
  "Baby steps.",
  "Chase dreams.",
  "Chasing sunsets.",
  "Chapter 1.",
  "Collecting moments, not things.",
  "Core memories",
  "Core memory.",
  "Courage.",
  "Create your own sunshine.",
  "Curiouser and curiouser.",
  "Current state.",
  "Details.",
  "Dream big, worry less.",
  "Dreaming.",
  "Do more things that make you forget to check your phone.",
  "Files.",
  "Focus.",
  "Fragments.",
  "Golden hour glow.",
  "Good vibes only.",
  "Grateful",
  "In motion.",
  "In my happy place",
  "Just be.",
  "Just breathe.",
  "Keep going, keep growing.",
  "Keep it simple.",
  "Less is more.",
  "Less perfection, more authenticity.",
  "Life is better when you're laughing.",
  "Live lightly, love deeply.",
  "Lately.",
  "Limitless.",
  "Lost in the moment.",
  "Making my own sunshine.",
  "Moments.",
  "Mood.",
  "No rain, no flowers.",
  "Offline.",
  "OOO.",
  "POV.",
  "Proof of life.",
  "Quiet luxury.",
  "Scenes.",
  "Slow down and soak it in.",
  "Soft life.",
  "Sunkissed and smiling.",
  "Start somewhere.",
  "Stay present.",
  "Sunshine in my soul.",
  "Thanks for the memories.",
  "The best life experiences are free.",
  "Visuals.",
  "Wild and free.",
];

export default function ShortCaptions() {
  return (
    <div className="my-12">
      {/* EXACT KEYWORD MATCH */}
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">02.</span> Short Instagram Captions
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        When the visual speaks for itself. Minimalist captions for the modern
        feed.
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
