// app/(marketing)/features/tiktok-scheduler/inbox.tsx

import { MessageCircle } from "lucide-react";

export default function Inbox() {
  return (
    <section className="mb-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Visual */}
        <div className="md:col-span-5 order-2 md:order-1">
          <div className="relative border-2 border-foreground bg-surface p-8 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 border border-foreground font-mono text-[10px] uppercase tracking-widest">
              Fan Mail
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 pb-4 border-b border-dashed border-foreground/20">
                <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm">@fan_account</span>
                    <span className="text-[9px] text-foreground/40 uppercase">
                      2m ago
                    </span>
                  </div>
                  <p className="text-xs font-serif text-foreground/80">
                    &quot;I needed to hear this today. Thank you!&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm">@collaborator</span>
                    <span className="text-[9px] text-foreground/40 uppercase">
                      1h ago
                    </span>
                  </div>
                  <p className="text-xs font-serif text-foreground/80">
                    &quot;The editing on this is next level. 🔥&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Copy */}
        <div className="md:col-span-7 order-1 md:order-2">
          <div className="mb-6 flex items-center gap-2 text-brand-primary">
            <MessageCircle className="w-6 h-6" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              The Correspondence Desk
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            Listen to the
            <br />
            applause.
          </h2>

          <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
            <p>
              Comments are not just metrics; they are people taking a moment to
              engage with your art.
            </p>
            <p>
              Our <strong>Unified Inbox</strong> collects every comment in one
              place, allowing you to reply, appreciate, and connect with your
              audience without the distraction of the infinite scroll.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
