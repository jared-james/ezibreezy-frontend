// app/(marketing)/editorial/_posts/instagram-captions-2025/motivational.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Be so good they can’t ignore you.",
  "Be the energy you want to attract.",
  "Bet on yourself.",
  "Consistency is the shortcut.",
  "Create the life you can't wait to wake up to.",
  "Create the standard.",
  "Create the things you wish existed.",
  "Discipline is freedom.",
  "Do it for your future self.",
  "Do it scared.",
  "Doubt kills more dreams than failure ever will.",
  "Dream big, work hard, stay humble.",
  "Dream it. Believe it. Achieve it.",
  "Energy flows where attention goes.",
  "Focus on the step, not the whole staircase.",
  "If it doesn’t challenge you, it won’t change you.",
  "Make today so awesome that yesterday gets jealous.",
  "Nothing changes if nothing changes.",
  "One day or day one.",
  "Small steps every day lead to big results.",
  "Stay focused.",
  "Success doesn’t come from what you do occasionally; it comes from what you do consistently.",
  "Success is not the key to happiness. Happiness is the key to success.",
  "Success is the sum of small efforts.",
  "The best view comes after the hardest climb.",
  "The comeback is always stronger than the setback.",
  "The harder you work, the luckier you get.",
  "The secret to getting ahead is getting started.",
  "The sky is not the limit. Your mind is.",
  "The work works.",
  "Trust the timing.",
  "Turning can't into can and dreams into plans.",
  "Volume 1.",
  "When nothing goes right, go left.",
  "Work until your idols become your rivals.",
  "You didn't come this far to only come this far.",
  "Your only limit is your mindset.",
  "Your potential is endless.",
  "“The best way to predict the future is to create it.”",
];

export default function MotivationalCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">13.</span> Motivational & Mindset
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        Reminders for the daily grind. Focus, discipline, and growth.
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
