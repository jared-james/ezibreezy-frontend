// app/(marketing)/features/tiktok-scheduler/technical-ledger.tsx

import { Crop, Eye, CheckCircle2, Image as ImageIcon } from "lucide-react";

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
              Feature Index
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
                    Ensure your visuals fit the frame. Crop your images to
                    Square, Landscape, Portrait, or Story dimensions right in
                    the browser.
                  </p>
                </div>
              </div>

              {/* Feature: Post Preview */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Eye className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Post Preview
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    See exactly how your video or carousel will look on the
                    &apos;For You&apos; page before it goes live. No surprises.
                  </p>
                </div>
              </div>

              {/* Feature: Creator Tools */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Creator Tools
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Working with partners? Easily mark your content as branded
                    or sponsored to maintain transparency and compliance.
                  </p>
                </div>
              </div>

              {/* Feature: Multi-Format */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Any Format
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    We support standard video uploads, static images, and
                    multi-image carousels. One tool for every way you create.
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
