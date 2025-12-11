// app/(marketing)/features/facebook-scheduler/inbox.tsx

import { Star, MessageSquare } from "lucide-react";

export default function Inbox() {
  return (
    <section className="mb-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Visual */}
        <div className="md:col-span-5 order-2 md:order-1">
          {/* UPDATED: Solid thin border instead of dotted, removed badge */}
          <div className="relative border border-foreground/20 bg-surface p-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-dashed border-foreground/20">
                <Star
                  className="w-5 h-5 text-brand-primary shrink-0 mt-1"
                  fill="currentColor"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-sm">New Review</span>
                    <div className="flex text-brand-primary text-[10px]">
                      ★★★★★
                    </div>
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
                    <span className="text-[9px] text-foreground/40 uppercase">
                      Now
                    </span>
                  </div>
                  <p className="text-xs font-serif text-foreground/80">
                    &ldquo;Do you have this in stock?&rdquo;
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
              Our <strong>Unified Inbox</strong> ensures you never miss a chance
              to say &ldquo;thank you&rdquo; or solve a problem. Manage
              comments, direct messages, and Page reviews from one quiet,
              organized space.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
