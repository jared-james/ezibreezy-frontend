// app/(marketing)/features/youtube-scheduler/inbox.tsx

import { MessageSquare } from "lucide-react";

export default function Inbox() {
  return (
    <section className="mb-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Visual */}
        <div className="md:col-span-5 order-2 md:order-1">
          <div className="relative border-2 border-foreground bg-surface p-8 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 border border-foreground font-mono text-[10px] uppercase tracking-widest">
              Viewer Feedback
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="bg-white p-3 border border-foreground/10 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                    <p className="text-xs font-serif italic text-foreground/80">
                      "I've been subscribed for 3 years and this is your
                      best work yet."
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-px w-4 bg-foreground/20" />
                    <span className="font-mono text-[9px] uppercase text-brand-primary font-bold">
                      Hearted & Replied
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Copy */}
        <div className="md:col-span-7 order-1 md:order-2">
          <div className="mb-6 flex items-center gap-2 text-brand-primary">
            <MessageSquare className="w-6 h-6" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              Community Management
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            Turn viewers into
            <br />a community.
          </h2>

          <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
            <p>
              A comment is a viewer taking the time to say, "I am here." It
              is an opportunity to turn a passive watcher into a loyal fan.
            </p>
            <p>
              Our <strong>Unified Inbox</strong> helps you manage the
              conversation. Reply to comments, heart the best ones, and
              build the kind of community that shows up for every upload.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
