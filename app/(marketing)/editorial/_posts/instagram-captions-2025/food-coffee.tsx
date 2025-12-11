// app/(marketing)/editorial/_posts/instagram-captions-2025/food-coffee.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "A la carte.",
  "Brunch club.",
  "Caffeine fix.",
  "Chef’s kiss.",
  "Coffee break.",
  "Coffee state of mind.",
  "Dining out.",
  "Eat well.",
  "First coffee, then everything else.",
  "Food for thought.",
  "Fuel.",
  "Good food, good mood.",
  "Life happens, coffee helps.",
  "Menu rotation.",
  "Morning ritual.",
  "On the table.",
  "Plated.",
  "Sip happens.",
  "Sweet tooth.",
  "Taste test.",

  // NEW ADDITIONS
  "Another sip, another smile.",
  "Brewed to perfection.",
  "Cafe crawl.",
  "Coffee pending.",
  "Comfort food era.",
  "Culinary adventure.",
  "Daily brew.",
  "Food is my love language.",
  "For the flavour.",
  "Fresh pour.",
  "Good taste lives here.",
  "In my brunch era.",
  "Just add coffee.",
  "Made with love (and butter).",
  "More espresso, less stress.",
  "Refill required.",
  "Small bites, big feelings.",
  "The perfect pour.",
  "This is my happy place.",
  "Today’s special.",
];

export default function FoodCoffeeCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">14.</span> Food & Coffee
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        For the foodies and the caffeine dependent.
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
