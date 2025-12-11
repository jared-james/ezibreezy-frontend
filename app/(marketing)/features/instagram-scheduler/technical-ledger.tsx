// app/(marketing)/features/instagram-scheduler/technical-ledger.tsx

import { CheckCircle2 } from "lucide-react";

export default function TechnicalLedger() {
  return (
    <section className="mb-24">
      <div className="border-t-4 border-double border-foreground pt-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3 pt-6">
            <h3 className="font-serif text-3xl font-bold leading-none mb-2">
              Technical
              <br />
              Ledger
            </h3>
            <p className="font-mono text-xs text-foreground/60">
              Full Feature Index
            </p>
          </div>

          <div className="md:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6">
              {/* List Items styled like classified ads */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Smart Stories
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Upload once. We automatically split long videos into
                    15-second segments so your narrative flows without
                    interruption.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Reel Sovereignty
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Control where your work lives. Toggle feed visibility,
                    upload custom covers, and select the perfect thumbnail
                    frame.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    First Comment
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Start the conversation or hide your hashtags. We auto-post
                    your first comment the second your content goes live.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Collaborator Invites
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Community is built together. Invite another account to be a
                    co-author on your post directly from the scheduler.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
