// app/(marketing)/features/youtube-scheduler/technical-ledger.tsx

import {
  Smartphone,
  Lock,
  Type,
  FileText,
  Image as ImageIcon,
  Sparkles,
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
              Broadcast Capabilities
            </p>
          </div>

          <div className="md:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6">
              {/* List Items styled like classified ads */}

              {/* Feature: Shorts */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Smartphone className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Shorts Publishing
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Capture the vertical feed. Publish videos up to 60
                    seconds long. We automatically detect the format and
                    optimize for the Shorts shelf.
                  </p>
                </div>
              </div>

              {/* Feature: Privacy */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Lock className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Privacy Control
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Control the release. Set your status to Private for
                    drafts, Unlisted for exclusive access, or Public when
                    you are ready to go live.
                  </p>
                </div>
              </div>

              {/* Feature: Titles */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Type className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Optimized Titles
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Write titles that get clicked. Use our integrated
                    checker to ensure your hook doesn't get truncated on
                    mobile devices.
                  </p>
                </div>
              </div>

              {/* Feature: Descriptions */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <FileText className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Rich Descriptions
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Add context, links, and timestamps. Format your
                    description to help SEO and guide viewers to your other
                    content.
                  </p>
                </div>
              </div>

              {/* Feature: Carousels (Community) */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Community Posts
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Engage between uploads. Publish image carousels (up to
                    10 slides) to your Community Tab to keep the
                    conversation going.
                  </p>
                </div>
              </div>

              {/* Feature: Thumbnails */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Sparkles className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Custom Thumbnails
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    The first impression matters. Upload custom high-res
                    thumbnails that stand out in a crowded subscription
                    feed.
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
