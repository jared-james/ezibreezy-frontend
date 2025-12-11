// app/(marketing)/editorial/_posts/instagram-captions-2025/travel.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Adventure awaits.",
  "Away.",
  "Be right back.",
  "Catch flights, not feelings.",
  "Chasing sunsets.",
  "Collecting moments.",
  "Current view.",
  "Detach and reconnect.",
  "Escapism.",
  "Finding paradise.",
  "Foreign.",
  "In transit.",
  "Mind on vacation.",
  "Out of office.",
  "Passport ready.",
  "Postcards from nowhere.",
  "Somewhere on Earth.",
  "Take the scenic route.",
  "Tourist for a day.",
  "Wanderlust mode.",

  // NEW ADDITIONS
  "All roads lead somewhere.",
  "Another stamp for the passport.",
  "Away game.",
  "Booked and blessed.",
  "Chasing horizons.",
  "Destination: unknown.",
  "Don’t wait for someday.",
  "Exploring with no agenda.",
  "Flight mode activated.",
  "Go where you feel most alive.",
  "Here for the journey.",
  "In my travel era.",
  "Journey in progress.",
  "Let the world surprise you.",
  "Lost but loving it.",
  "Off the map.",
  "Out here collecting sunsets.",
  "Roaming free.",
  "Seeking new stories.",
  "Suitcase essentials only.",
];

export default function TravelCaptions() {
  return (
    <div className="my-12">
      {/* EXACT KEYWORD MATCH */}
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">06.</span> Instagram Captions for
        Travel
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        From city breaks to remote escapes. Captions for the wanderer.
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
