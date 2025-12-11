// app/(marketing)/editorial/_posts/instagram-captions-2025/lyrics.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Doing it for the plot.",
  "Don't stop believin'.",
  "Feeling good as hell.",
  "Forever young.",
  "Golden state of mind.",
  "I can buy myself flowers.",
  "I'm the problem, it's me.",
  "It's a vibe.",
  "Just like magic.",
  "Karma is a god.",
  "Life is a highway.",
  "Live fast, die young.",
  "Nothing was the same.",
  "Shine bright like a diamond.",
  "Started from the bottom.",
  "Sun is shining, the weather is sweet.",
  "Thank u, next.",
  "Unwritten.",
  "We found love in a hopeless place.",
  "Wildest dreams.",

  // NEW ADDITIONS
  "A little bit psycho.",
  "All eyes on me.",
  "Baby, I'm a star.",
  "Can't tell me nothing.",
  "Caught a vibe.",
  "Dancing in the dark.",
  "Everything I wanted.",
  "Good days on my mind.",
  "Higher than I've ever been.",
  "I got that sunshine in my pocket.",
  "I'm feeling myself.",
  "In my head, it's just you.",
  "Living for the weekend.",
  "Losing it over you.",
  "Meet me at midnight.",
  "No tears left to cry.",
  "On my worst behavior.",
  "Say my name.",
  "This is what dreams are made of.",
  "You make me feel like dancing.",
];

export default function LyricCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">17.</span> Song Lyrics
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        When music says it better than you can.
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
