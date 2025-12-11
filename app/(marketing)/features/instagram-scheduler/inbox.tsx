// app/(marketing)/features/instagram-scheduler/inbox.tsx

import { Inbox as InboxIcon, MessageCircle, AtSign, Mail } from "lucide-react";

export default function Inbox() {
  return (
    <section className="mb-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Visual representation of a letter/inbox */}
        <div className="md:col-span-5 order-2 md:order-1">
          <div className="relative border border-foreground/20 bg-surface p-8">
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
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            Social Inbox
          </h2>

          <div className="prose prose-lg font-serif text-foreground/80 leading-relaxed">
            <p>
              Our <strong>Social Inbox</strong> captures every comment, mention,
              and direct message in one organized stream. Respond to customer
              queries and fan love efficiently, without ever opening the
              distracting mobile app.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
