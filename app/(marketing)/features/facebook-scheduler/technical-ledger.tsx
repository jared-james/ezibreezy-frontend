// app/(marketing)/features/facebook-scheduler/technical-ledger.tsx

import {
  Crop,
  Tv,
  Layers,
  Type,
  Users,
  MapPin,
  Eye,
  CheckCircle2,
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
              {/* List Items styled like classified ads */}

              {/* Feature: Image Cropping */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Crop className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Image Cropping
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Crop to square, landscape, portrait, or story. Ensure
                    your visuals look professional on every device.
                  </p>
                </div>
              </div>

              {/* Feature: Reels & Stories */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Tv className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Reels & Stories
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Publish images or videos up to 1 minute long. Keep your
                    Page active with ephemeral content and engaging
                    short-form video.
                  </p>
                </div>
              </div>

              {/* Feature: Carousel Publishing */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Layers className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Link Carousels
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Drive traffic. Publish carousels with titles,
                    descriptions, and URLs. Include up to 10 images or
                    videos in a single swipeable unit.
                  </p>
                </div>
              </div>

              {/* Feature: Text Publishing */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Type className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Status Updates
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Sometimes the message is simple. Publish text-only posts
                    to keep your community informed.
                  </p>
                </div>
              </div>

              {/* Feature: Tagging */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Users className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Tag Pages
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Build connections. Tag other Facebook Pages by typing @
                    to increase visibility and foster partnerships.
                  </p>
                </div>
              </div>

              {/* Feature: Location */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <MapPin className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Location Tagging
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Put yourself on the map. Search and add locations to
                    your posts to drive local discovery.
                  </p>
                </div>
              </div>

              {/* Feature: Preview */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Eye className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Post Preview
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    See exactly how your post will look in the News Feed
                    before you publish. Perfect every detail.
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
                    Add accessible Alt Text to your images. Ensure your
                    content is inclusive for everyone in your community.
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
