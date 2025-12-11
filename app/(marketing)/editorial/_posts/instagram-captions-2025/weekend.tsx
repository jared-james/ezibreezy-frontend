// app/(marketing)/editorial/_posts/instagram-captions-2025/weekend.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Brunch club.",
  "Cozy vibes only.",
  "Current mood: Chill.",
  "Do not disturb.",
  "Doing nothing is an art.",
  "Easy like Sunday morning.",
  "Lazy days.",
  "Low battery.",
  "Mental health day.",
  "Offline.",
  "Out of pocket.",
  "Pause button.",
  "Recharging.",
  "See you Monday.",
  "Self-care Sunday.",
  "Sleep in.",
  "Slow mornings.",
  "Sunday reset.",
  "Weekend loading...",
  "Weekends are for... nothing.",

  // NEW ADDITIONS
  "Bare minimum mode.",
  "Battery: Recovering.",
  "Booked for rest.",
  "Canceling plans is self-care.",
  "Chill mode activated.",
  "Day off energy.",
  "Doing less, feeling more.",
  "Gentle weekend.",
  "Here for the soft life.",
  "Just resting my eyes.",
  "Letting the day happen.",
  "Loose plans only.",
  "No alarms needed.",
  "Nothing urgent, nothing serious.",
  "Reset in progress.",
  "Resting responsibly.",
  "Soft reset.",
  "Taking it slow.",
  "The weekend effect.",
  "This is my off switch.",
];

export default function WeekendCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">22.</span> Weekend & Chill
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        The art of doing nothing. Captions for the reset.
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
