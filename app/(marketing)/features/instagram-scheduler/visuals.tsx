// app/(marketing)/features/instagram-scheduler/visuals.tsx

import { MessageCircle, AtSign, Mail } from "lucide-react";
import InstagramGridBoard from "@/components/landing-page/instagram-grid";

export function InstagramHeroVisual() {
  return (
    <>
      <div className="flex justify-between items-center mb-6 opacity-60 font-mono text-[10px] uppercase tracking-widest">
        <span>Fig 1. The Visual Canvas</span>
        <span>Interactive Preview</span>
      </div>

      {/* Existing Grid Component */}
      <InstagramGridBoard />

      <div className="mt-6 text-center">
        <p className="font-mono text-xs text-brand-primary font-bold uppercase tracking-widest">
          ↑ Drag to Reorder
        </p>
      </div>
    </>
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
