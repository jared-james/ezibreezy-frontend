// app/(marketing)/features/pinterest-scheduler/visuals.tsx

import Image from "next/image";
import { MessageCircle } from "lucide-react";

export function PinterestHeroVisual() {
  return (
    /* 
       -m-8: Cancels out the 'p-8' padding of the parent container so the image hits the edges.
       w-[calc(100%+4rem)]: Ensures the width fills the space created by the negative margin.
    */
    <div className="-m-8 w-[calc(100%+4rem)] bg-background-editorial">
      <Image
        src="/marketing/features/features_pin.webp"
        alt="Pinterest Scheduler Interface"
        width={1200}
        height={1000}
        quality={70}
        priority
        className="w-full h-auto object-cover"
      />
    </div>
  );
}

export function PinterestInboxVisual() {
  return (
    <div className="space-y-6">
      {/* Comment Visual */}
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
            <p className="text-xs font-serif italic text-foreground/80">
              &quot;Tried this tutorial last weekend. The results were
              amazing!&quot;
            </p>
          </div>
          {/* Reply Indicator */}
          <div className="flex items-center gap-2 pl-1">
            <div className="h-px w-4 bg-foreground/20" />
            <span className="font-mono text-[9px] uppercase text-brand-primary font-bold flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> Reply Sent
            </span>
          </div>
        </div>
      </div>

      {/* Second Comment (Ghosted) */}
      <div className="flex items-start gap-4 opacity-50">
        <div className="w-6 h-6 rounded-full bg-foreground/10 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="bg-white p-2 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
            <div className="h-2 w-24 bg-foreground/10 rounded mb-1" />
            <div className="h-2 w-16 bg-foreground/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
