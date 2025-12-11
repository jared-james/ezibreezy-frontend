// app/(marketing)/features/facebook-scheduler/visuals.tsx

import Image from "next/image";
import { Star, MessageSquare } from "lucide-react";

export function FacebookHeroVisual() {
  return (
    /* 
       -m-8: Cancels out the 'p-8' padding of the parent container so the image hits the edges.
       w-[calc(100%+4rem)]: Ensures the width fills the space created by the negative margin.
    */
    <div className="-m-8 w-[calc(100%+4rem)] bg-background-editorial">
      <Image
        src="/marketing/features/features_facebook.webp"
        alt="Facebook Scheduler Interface"
        width={1200}
        height={1000}
        quality={100}
        priority
        /* 
           h-auto: Allows the height to grow naturally so the full image is shown.
           w-full: Fills the container width.
        */
        className="w-full h-auto object-cover"
      />
    </div>
  );
}

export function FacebookInboxVisual() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 pb-4 border-b border-dashed border-foreground/20">
        <Star
          className="w-5 h-5 text-brand-primary shrink-0 mt-1"
          fill="currentColor"
        />
        <div className="space-y-1 flex-1">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-sm">New Review</span>
            <div className="flex text-brand-primary text-[10px]">★★★★★</div>
          </div>
          <p className="text-xs font-serif text-foreground/80">
            &ldquo;Absolutely love this place. The service is...&rdquo;
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <MessageSquare className="w-5 h-5 text-brand-primary shrink-0 mt-1" />
        <div className="space-y-1 flex-1">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-sm">New Message</span>
            <span className="text-[9px] text-foreground/40 uppercase">Now</span>
          </div>
          <p className="text-xs font-serif text-foreground/80">
            &ldquo;Do you have this in stock?&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
