// app/(marketing)/editorial/_posts/instagram-captions-2025/birthday.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Act your age? Never.",
  "Aging like a classic song—only getting better.",
  "Aging like fine wine.",
  "Another lap around the sun.",
  "Another trip around the sun, and still shining.",
  "Another year closer to those senior citizen discounts!",
  "A year older, a year bolder.",
  "Blessed to see another year.",
  "Birthday behavior.",
  "Born day.",
  "Celebrating me.",
  "Chapter [Age].",
  "Chapter [age] begins now.",
  "Feeling grateful for another year of adventures.",
  "Feeling [insert age].",
  "Go shawty.",
  "Grateful for another year.",
  "Growing stronger each year, thanks to our customers!",
  "Growing up is optional, growing old is mandatory.",
  "Growing wiser, not just older.",
  "Happy cake day!",
  "HBD to the MVP!",
  "Here for the cake.",
  "Here’s to another year of making dreams come true.",
  "I don't know about you, but I'm feeling [insert age].",
  "It’s my party.",
  "Keep them guessing.",
  "Level up.",
  "Level unlocked.",
  "Make a wish.",
  "Making [age] look good.",
  "More candles, more memories, more fun.",
  "More life.",
  "Old enough to know better, young enough to do it anyway.",
  "Older, wiser, hotter.",
  "One year bolder.",
  "Personal new year.",
  "Season [Age] episode 1.",
  "Today’s forecast: 100% chance of cake.",
  "Your life is a beautiful story. Here's to writing your next chapter.",
];

export default function BirthdayCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">18.</span> Birthday
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        For your personal new year. Celebration without the cheese.
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
