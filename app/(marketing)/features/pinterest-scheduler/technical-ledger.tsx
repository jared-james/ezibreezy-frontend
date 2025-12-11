// app/(marketing)/features/pinterest-scheduler/technical-ledger.tsx

import {
  Users,
  Pin,
  Layout,
  Link as LinkIcon,
  CheckCircle2,
  Video,
  Type,
  Image as ImageIcon,
} from "lucide-react";

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
              Curation Capabilities
            </p>
          </div>

          <div className="md:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6">
              {/* List Items styled like classified ads */}

              {/* Feature: Multi-Account */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Users className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Accounts
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Manage multiple identities. Connect any Pinterest
                    account and switch between client portfolios or brand
                    verticals instantly.
                  </p>
                </div>
              </div>

              {/* Feature: Scheduler */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Pin className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Direct Scheduling
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Set it and forget it. Schedule Pins to go live at
                    specific times to capture your audience when they are
                    most active.
                  </p>
                </div>
              </div>

              {/* Feature: Board Management */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Layout className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Board Organization
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Create new Boards directly from the composer. Ensure
                    every Pin finds its perfect home in your structured
                    library.
                  </p>
                </div>
              </div>

              {/* Feature: Traffic (Links) */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <LinkIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Destination Links
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Drive traffic where it matters. Add destination URLs to
                    every Pin to turn inspiration into website visits.
                  </p>
                </div>
              </div>

              {/* Feature: Accessibility */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Accessible Features
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Add descriptive Alt Text to your scheduled images.
                    Improve SEO discovery while making your content
                    inclusive.
                  </p>
                </div>
              </div>

              {/* Feature: Video Pins */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Video className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Video Pins
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Motion grabs attention. Upload video Pins with custom
                    covers to stand out in a static feed.
                  </p>
                </div>
              </div>

              {/* Feature: Rich Details */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Type className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Rich Details
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Add keyword-rich titles and descriptions (up to 500
                    chars) to ensure your content is found by the right
                    people.
                  </p>
                </div>
              </div>

              {/* Feature: Image Publishing */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Visual Fidelity
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    We support high-resolution uploads. Your visuals are the
                    product; we ensure they look pristine.
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
