// app/(marketing)/editorial/_posts/instagram-captions-2025/witty.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "50% savage, 50% sweetheart.",
  "Born to stand out.",
  "Confidence level: Kanye.",
  "Current status: Hungry.",
  "Do I look like I know what I'm doing?",
  "Don't study me, you won't graduate.",
  "Holding it together with dry shampoo and iced coffee.",
  "I need a six-month holiday, twice a year.",
  "I put the 'pro' in procrastinate.",
  "I’d agree with you, but then we’d both be wrong.",
  "Life status: Currently holding it all together with one bobby pin.",
  "Maybe she's born with it, maybe it's the filter.",
  "My autobiography.",
  "Not everyone likes me, but not everyone matters.",
  "Professional overthinker.",
  "Reality called, I hung up.",
  "Sarcasm is my love language.",
  "Sending this selfie to NASA because I’m a star.",
  "Sent from my iPhone.",
  "Too glam to give a damn.",

  // NEW ADDITIONS
  "A little confused, but making it fashion.",
  "Apparently, adulthood is just Googling everything.",
  "Available for brunch, unavailable for nonsense.",
  "Currently avoiding responsibilities.",
  "Doing my best… interpret that however you want.",
  "Everything is figureoutable. Except my schedule.",
  "I don’t rise and shine; I caffeinate and hope.",
  "If lost, return to coffee.",
  "Just winging it. Life, eyeliner, everything.",
  "Living proof that chaos can be cute.",
  "Mentally, I'm OOO.",
  "My patience is on airplane mode.",
  "My vibe is ‘try again tomorrow.’",
  "Running late is my cardio.",
  "Sassy, classy, and a little smart-assy.",
  "Scrolling is self-care.",
  "Surviving on vibes and iced coffee.",
  "This is my ‘I tried’ aesthetic.",
  "Trying to function… please wait.",
  "Unapologetically inconsistent.",
];

export default function WittyCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">12.</span> Witty & Clever
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        For when you want to show personality without trying too hard.
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
