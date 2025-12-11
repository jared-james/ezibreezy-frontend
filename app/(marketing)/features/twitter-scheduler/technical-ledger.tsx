// app/(marketing)/features/twitter-scheduler/technical-ledger.tsx

import {
  Crop,
  Type,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  AtSign,
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
                    your media looks intentional, not accidental.
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
                    Publish text-only posts. We handle the character count
                    and threading logic for you.
                  </p>
                </div>
              </div>

              {/* Feature: Video Publishing */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Video className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Video Support
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Publish videos up to 250MB. Share clips, animations, and
                    moments directly to the feed.
                  </p>
                </div>
              </div>

              {/* Feature: Image Publishing */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <ImageIcon className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    High-Res Images
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Publish images up to 5MB. Maintain the fidelity of your
                    photos and graphics.
                  </p>
                </div>
              </div>

              {/* Feature: Carousel */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <CheckCircle2 className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Multi-Image Grid
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Tell a visual story. Publish carousels with up to 4
                    images that display as a clean grid in the feed.
                  </p>
                </div>
              </div>

              {/* Feature: Alt Text */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Eye className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Alt Text
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Add accessible alt text to images. Make your content
                    inclusive for everyone in your audience.
                  </p>
                </div>
              </div>

              {/* Feature: Mentions */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <AtSign className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Mention Users
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Tag collaborators and friends. Mention other Twitter
                    accounts directly in the composer.
                  </p>
                </div>
              </div>

              {/* Feature: Preview */}
              <div className="flex items-start gap-3 pb-6 border-b border-dotted border-foreground/30">
                <Sparkles className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                <div>
                  <strong className="block font-serif text-lg mb-1">
                    Post Preview
                  </strong>
                  <p className="font-serif text-sm text-foreground/70">
                    Preview how your post will look once published. Check
                    line breaks and media layout before you tweet.
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
