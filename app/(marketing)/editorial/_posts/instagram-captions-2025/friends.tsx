// app/(marketing)/editorial/_posts/instagram-captions-2025/friends.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Better together.",
  "Cheers to us.",
  "Chosen family.",
  "Collect moments, not things.",
  "Creating memories.",
  "Day ones.",
  "Good company.",
  "Inside jokes.",
  "Life is better with you.",
  "Love you guys.",
  "My people.",
  "No new friends.",
  "Partners in crime.",
  "Pure joy.",
  "Quality time.",
  "Real ones.",
  "Support system.",
  "The circle.",
  "Unbreakable.",
  "Vibe check: Passed.",

  // NEW ADDITIONS
  "All love here.",
  "Better than therapy.",
  "Born for this chaos together.",
  "Bringing out the best in each other.",
  "Certified good vibes crew.",
  "Friends who feel like sunshine.",
  "Grateful for this crew.",
  "Group chat energy.",
  "How lucky am I?",
  "Laughing for no reason again.",
  "Made memories, will make more.",
  "No one does it like us.",
  "Our kind of chaos.",
  "Same time next week?",
  "Soul friends.",
  "The best people are the ones you keep.",
  "The laughter was the loudest.",
  "This is my inner circle.",
  "We show up for each other.",
  "Wouldn't trade this for anything.",
];

export default function FriendsCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">20.</span> Friends & Social
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        Celebrating the people who make life better.
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
