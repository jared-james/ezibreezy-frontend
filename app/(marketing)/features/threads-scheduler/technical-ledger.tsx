// app/(marketing)/features/threads-scheduler/technical-ledger.tsx

import {
  Crop,
  MessageCircle,
  Layers,
  Image as ImageIcon,
  Hash,
  Type,
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
              Publishing Capabilities
            </p>
          </div>

          <div className="md:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-6">
              {/* Feature: Image Cropping */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Crop className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Image Cropping
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Crop to square, landscape, portrait, or story. Ensure
                    your visuals look intentional, whether it&apos;s a quick snap
                    or a polished graphic.
                  </p>
                </div>
              </div>

              {/* Feature: Native Threading */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <MessageCircle className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Auto-Threading
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Write as much as you need. We automatically split long
                    text into a connected chain of posts (500 chars each) so
                    your thought stays intact.
                  </p>
                </div>
              </div>

              {/* Feature: Carousels */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Layers className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Carousel Publishing
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Tell a visual story. Publish carousels with up to 10
                    images or videos that users can swipe through natively.
                  </p>
                </div>
              </div>

              {/* Feature: Mixed Media */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Mixed Media
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Combine photos and videos in the same post or carousel.
                    We handle the formatting so it looks seamless.
                  </p>
                </div>
              </div>

              {/* Feature: Topic Tags */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Hash className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Topic Tags
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Join the wider conversation. Add one Topic Tag per post
                    to help your content get discovered by the right people.
                  </p>
                </div>
              </div>

              {/* Feature: Text Publishing */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Type className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Text Publishing
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Keep it simple. Publish text-only updates when you want
                    to spark a discussion without the need for visuals.
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
