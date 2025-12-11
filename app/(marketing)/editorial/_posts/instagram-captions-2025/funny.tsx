// app/(marketing)/editorial/_posts/instagram-captions-2025/funny.tsx

"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const captions = [
  "Building an empire... one typo at a time.",
  "I don’t need a hairstylist, my pillow gives me a new style every morning.",
  "I like big books, and I cannot lie.",
  "I need six months of vacation, twice a year.",
  "I put the 'el' in modeling. Well, not really, but I tried.",
  "I put the ‘pro’ in procrastinate.",
  "I'm just here for the food.",
  "I'm not arguing, I'm just explaining why I'm right.",
  "I'm not lazy, I'm on energy-saving mode.",
  "I’m not saying I’m lazy, but… OK, fine, I am lazy.",
  "If I had a dollar for every time I got distracted, I wish I had a puppy.",
  "Is it too late to be a morning person?",
  "Life update: Still alive, still funny, still hungry.",
  "Maybe she’s born with it, maybe it’s an Instagram filter.",
  "My favorite exercise is a cross between a lunge and a crunch ... I call it lunch.",
  "Putting the ‘pro' in procrastination.",
  "Reality called, so I hung up.",
  "Some people graduate with honors, I am just honored to graduate from my bed every morning.",

  // NEW ADDITIONS
  "Acting natural is my full-time job.",
  "BRB, overthinking everything.",
  "Can’t talk right now, doing hot-person things (napping).",
  "Currently accepting snack donations.",
  "Doing my best… the results may vary.",
  "Found the reason I’m always tired: it’s me.",
  "Hot mess, but make it aesthetic.",
  "I came. I saw. I forgot what I was doing.",
  "I don’t rise and shine; I caffeinate and hope.",
  "I live in a constant state of ‘it is what it is.’",
  "In my defense, I was left unsupervised.",
  "Ironically, my life has no chill.",
  "Let’s pretend this was candid.",
  "Mentally, I’m still on the couch.",
  "My toxic trait? Thinking I’ll be productive later.",
  "Not sure if I’m thriving or just vibing.",
  "Out of office (mentally).",
  "Running on vibes and poor decisions.",
  "This is my ‘I tried’ face.",
  "Why be moody when you can shake your booty?",
];

export default function FunnyCaptions() {
  return (
    <div className="my-12">
      <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <span className="text-brand-primary">01.</span> Funny Instagram Captions
      </h3>
      <p className="text-foreground/80 mb-6 italic">
        For when you look great but don't want to seem like you're trying too
        hard.
      </p>

      <div className="grid grid-cols-1 gap-4">
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
