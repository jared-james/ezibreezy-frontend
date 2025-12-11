// app/(marketing)/features/instagram-scheduler/visuals.tsx

import Image from "next/image";
import { MessageCircle, AtSign, Mail } from "lucide-react";

export function InstagramHeroVisual() {
  return (
    /* 
       -m-8: Cancels out the 'p-8' padding of the parent container so the image hits the edges.
       w-[calc(100%+4rem)]: Ensures the width fills the space created by the negative margin.
    */
    <div className="-m-8 w-[calc(100%+4rem)] bg-background-editorial">
      <Image
        src="/marketing/features/features_instagram.webp"
        alt="Instagram Scheduler Interface"
        width={1200}
        height={1000}
        quality={100}
        priority
        className="w-full h-auto object-cover"
      />
    </div>
  );
}

export function InstagramInboxVisual() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 pb-4 border-b border-dashed border-foreground/20">
        <MessageCircle className="w-4 h-4 mt-1 text-brand-primary" />
        <div>
          <p className="font-bold text-sm font-serif">Post Comments</p>
          <p className="text-xs text-foreground/60">
            Reply to the conversation happening in the open.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 pb-4 border-b border-dashed border-foreground/20">
        <AtSign className="w-4 h-4 mt-1 text-brand-primary" />
        <div>
          <p className="font-bold text-sm font-serif">Mentions & Tags</p>
          <p className="text-xs text-foreground/60">
            Acknowledge those who are spreading your message.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Mail className="w-4 h-4 mt-1 text-brand-primary" />
        <div>
          <p className="font-bold text-sm font-serif">Direct Messages</p>
          <p className="text-xs text-foreground/60">
            Nurture the 1-on-1 relationships that build loyalty.
          </p>
        </div>
      </div>
    </div>
  );
}
