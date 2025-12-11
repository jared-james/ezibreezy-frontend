// app/(marketing)/editorial/_posts/instagram-captions-2025/aesthetic.tsx

"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "About last night.",
  "After hours.",
  "Blurry.",
  "Chaos and calm.",
  "City lights.",
  "Dark mode.",
  "Flash on.",
  "In the dark.",
  "Lost in the night.",
  "Midnight memories.",
  "Moon child.",
  "Neon dreams.",
  "Night owl.",
  "Night shift.",
  "Night vision.",
  "No sleep club.",
  "Twilight.",
  "Under the influence (of the moon).",
  "Until dawn.",
  "Up late.",

  // NEW ADDITIONS
  "After midnight.",
  "Blue hour haze.",
  "Cold neon glow.",
  "Electric nights.",
  "Eyes wide open.",
  "Fading into the night.",
  "Flashback moment.",
  "Late-night nostalgia.",
  "Lit by the moon.",
  "Midnight playlist.",
  "Moonlit moods.",
  "Nightfall energy.",
  "Off the grid (temporarily).",
  "Out past curfew.",
  "Shadows and silhouettes.",
  "Somewhere after midnight.",
  "The city never sleeps.",
  "The night said yes.",
  "Under streetlights.",
  "Vibes after dark.",
];

export default function AestheticCaptions() {
  return (
    <div className="my-12">
      {/* EXACT KEYWORD MATCH */}
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">08.</span> Aesthetic Instagram
        Captions
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        For the blurry photos, the flash dumps, and the visual vibes.
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
