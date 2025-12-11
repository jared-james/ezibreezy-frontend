// app/(marketing)/features/instagram-scheduler/inbox.tsx

import { Inbox as InboxIcon, MessageCircle, AtSign, Mail } from "lucide-react";

export default function Inbox() {
  return (
    <section className="mb-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Visual representation of a letter/inbox */}
        <div className="md:col-span-5 order-2 md:order-1">
          <div className="relative border-2 border-foreground bg-surface p-8 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 border border-foreground font-mono text-[10px] uppercase tracking-widest">
              Incoming Correspondence
            </div>

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
                  <p className="font-bold text-sm font-serif">
                    Mentions & Tags
                  </p>
                  <p className="text-xs text-foreground/60">
                    Acknowledge those who are spreading your message.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 text-brand-primary" />
                <div>
                  <p className="font-bold text-sm font-serif">
                    Direct Messages
                  </p>
                  <p className="text-xs text-foreground/60">
                    Nurture the 1-on-1 relationships that build loyalty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Copy */}
        <div className="md:col-span-7 order-1 md:order-2">
          <div className="mb-6 flex items-center gap-2 text-brand-primary">
            <InboxIcon className="w-6 h-6" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              The Unified Inbox
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            Publishing is just
            <br />
            the beginning.
          </h2>

          <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
            <p>
              The real magic doesn&apos;t happen when you speak; it happens when
              you respond.
            </p>
            <p>
              Every comment is a person raising their hand to say, &quot;I hear
              you.&quot; Every DM is an invitation to deepen the relationship.
              EziBreezy brings every comment, mention, and message into one
              quiet, organized desk so you never miss an opportunity to connect.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
