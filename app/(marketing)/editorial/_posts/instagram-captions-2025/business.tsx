// app/(marketing)/editorial/_posts/instagram-captions-2025/business.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "1% better every day.",
  "Alexa, add everything to my cart!",
  "Because retail therapy is real therapy.",
  "Behind every small business is a dream, hard work, and dedication.",
  "Behind the brand.",
  "Big dreams, tiny team.",
  "Build in public.",
  "Client love.",
  "Cute things inside — handle with care!",
  "Doing what we love for people who love what we do.",
  "Dream big, shop small.",
  "Every big brand started as a small business. Thanks for being part of our journey!",
  "Every order makes us do a happy dance!",
  "Founders log: Day 1.",
  "Growth mode: Activated.",
  "Handmade, heartfelt, and hustle-driven.",
  "Hustling hard so you don’t have to shop anywhere else!",
  "Laughter is the best medicine, but our products are a close second.",
  "Local, loyal, and loving what we do!",
  "Made with passion, sold with love.",
  "Making cool stuff since [year].",
  "Making it happen.",
  "More than a brand — it's a labor of love.",
  "Not just a business, a mindset.",
  "Not just a product, but a whole vibe.",
  "No big investors, just big dreams.",
  "Office hours.",
  "One purchase, one smile, one step closer to our dreams.",
  "Process over outcome.",
  "Quality control.",
  "Quality over quantity, always.",
  "Running a small business: 50% passion, 50% coffee!",
  "Shipped.",
  "Shopping here is a form of self-care.",
  "Small business, big dreams, endless possibilities.",
  "Small business, big vision.",
  "Strategy session.",
  "Thanks for supporting our dream.",
  "The hustle is real.",
  "The view from the desk.",
  "Warning: Shopping here may cause extreme happiness.",
  "We’re not just a business; we’re a community.",
  "What they don't see.",
  "Who needs therapy when you can shop here?",
  "Work in progress.",
  "You're not just buying a product; you're supporting a dream.",
  "Your support means the world.",
  "Your support means the world to our small business!",
  "When you buy from a small business, an actual person does a little happy dance.",
];

export default function BusinessCaptions() {
  return (
    <div className="my-12">
      {/* EXACT KEYWORD MATCH */}
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">10.</span> Instagram Captions for
        Business
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        Document the journey. Authentic captions for builders and creators.
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
