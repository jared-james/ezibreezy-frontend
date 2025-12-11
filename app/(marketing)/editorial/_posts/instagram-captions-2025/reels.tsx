// app/(marketing)/editorial/_posts/instagram-captions-2025/reels.tsx
"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "3 tips for [Topic] 👇",
  "Behind the scenes.",
  "Day in the life.",
  "Don't scroll past.",
  "How it started vs how it's going.",
  "Link in bio.",
  "Mini vlog.",
  "POV.",
  "Process.",
  "Read the caption 👇",
  "Remix this.",
  "Save this for later.",
  "Sound on 🔊",
  "Stop doing this 🛑",
  "Tag a friend who needs this.",
  "The secret sauce.",
  "This is your sign.",
  "Unpopular opinion...",
  "Wait for the end.",
  "Which one are you?",

  // NEW ADDITIONS
  "Add this to your list.",
  "Before you scroll...",
  "Change my mind.",
  "Do this instead.",
  "Don’t make this mistake.",
  "For anyone who needs to hear this.",
  "Here’s what no one tells you.",
  "If you know, you know.",
  "Learn this now.",
  "Let’s talk about it.",
  "No one is talking about this.",
  "One thing I wish I knew sooner.",
  "Quick tip:",
  "Real talk.",
  "Swipe for the glow-up.",
  "The part you weren’t expecting.",
  "Things I wish I learned earlier.",
  "Watch till the end.",
  "You’re doing it wrong.",
  "Your sign to start today.",
];

export default function ReelsCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">09.</span> Instagram Reel Captions
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        Hooks and CTAs designed to stop the scroll and drive engagement.
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
