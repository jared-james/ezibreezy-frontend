// app/(marketing)/features/linkedin-scheduler/technical-ledger.tsx

import {
  Crop,
  Type,
  CheckCircle2,
  Image as ImageIcon,
  Eye,
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
                    Crop your visuals directly in the editor. Choose from
                    Square, Landscape, Portrait, or Story ratios for a perfect
                    fit.
                  </p>
                </div>
              </div>

              {/* Feature: Text Publishing */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Type className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Text-Only Posts
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Sometimes words are enough. Publish text-only updates
                    formatted with clarity to spark discussion.
                  </p>
                </div>
              </div>

              {/* Feature: Carousels */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Carousel Publishing
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Tell a deeper story. Publish carousels with up to 9 images
                    or videos to keep your audience engaged longer.
                  </p>
                </div>
              </div>

              {/* Feature: Rich Media */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Image & Video
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Support for high-quality single image and video posts. We
                    handle the optimization so your content looks crisp.
                  </p>
                </div>
              </div>

              {/* Feature: Alt Text */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Accessibility
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Add descriptive Alt Text to your images. Ensure your
                    insights are accessible to everyone in your network.
                  </p>
                </div>
              </div>

              {/* Feature: Tagging */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Tag Pages
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Give credit where it is due. Tag other LinkedIn company
                    pages by simply typing @ to expand your reach.
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
                    See exactly how your post will look in the feed before you
                    publish. No formatting surprises.
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
