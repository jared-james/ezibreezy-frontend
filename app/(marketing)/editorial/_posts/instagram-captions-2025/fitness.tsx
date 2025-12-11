// app/(marketing)/editorial/_posts/instagram-captions-2025/fitness.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Active rest.",
  "Body under construction.",
  "Consistency is key.",
  "Do the work.",
  "Endorphins.",
  "Focus mode.",
  "Gym therapy.",
  "Health is wealth.",
  "In the lab.",
  "Invest in yourself.",
  "Mind over matter.",
  "Mindset shift.",
  "Movement.",
  "Pilates princess.",
  "Run the day.",
  "Self-care is discipline.",
  "Strong is the new pretty.",
  "Stronger than yesterday.",
  "Sweat equity.",
  "Wellness era.",

  // NEW ADDITIONS
  "A little stronger today.",
  "Building the foundation.",
  "Daily discipline.",
  "Elevate your routine.",
  "Every rep counts.",
  "Find your edge.",
  "Form first.",
  "Fuel the machine.",
  "Habit > motivation.",
  "In progress mode.",
  "It's a lifestyle.",
  "Less excuses, more movement.",
  "One more rep.",
  "Progress over perfection.",
  "Reset. Recharge. Repeat.",
  "Show up for you.",
  "Slow, steady, strong.",
  "Stronger in every way.",
  "Trust the process.",
  "Wellness, always.",
];

export default function FitnessCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">15.</span> Fitness & Wellness
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        Health, movement, and the pursuit of strength.
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
