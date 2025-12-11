// app/(marketing)/features/youtube-scheduler/inbox.tsx

import { MessageSquare, Heart } from "lucide-react";

export default function Inbox() {
  return (
    <section className="mb-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Visual */}
        <div className="md:col-span-5 order-2 md:order-1">
          {/* UPDATED: Clean, thin border style */}
          <div className="relative border border-foreground/20 bg-surface p-8">
            <div className="space-y-6">
              {/* Comment Visual */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                    <p className="text-xs font-serif italic text-foreground/80">
                      &quot;I&apos;ve been subscribed for 3 years and this is
                      your best work yet.&quot;
                    </p>
                  </div>
                  {/* Reply Indicator */}
                  <div className="flex items-center gap-2 pl-1">
                    <div className="h-px w-4 bg-foreground/20" />
                    <span className="font-mono text-[9px] uppercase text-brand-primary font-bold flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-brand-primary" /> Hearted &
                      Replied
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
          </div>
        </div>

        {/* Editorial Copy */}
        <div className="md:col-span-7 order-1 md:order-2">
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            Social Inbox
          </h2>

          <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
            <p>
              Our <strong>Social Inbox</strong> helps you manage the
              conversation. Reply to comments, heart the best ones, and build
              the kind of community that shows up for every upload.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
