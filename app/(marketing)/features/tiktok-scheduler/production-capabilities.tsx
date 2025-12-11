// app/(marketing)/features/tiktok-scheduler/production-capabilities.tsx

import { Video, Layers, Sparkles, Lock } from "lucide-react";

export default function ProductionCapabilities() {
  return (
    <section className="mb-24">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="font-mono text-xs uppercase tracking-widest font-bold bg-foreground text-background px-2 py-1">
          Production Capabilities
        </h3>
        <div className="h-px flex-1 bg-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-2 border-foreground">
        {/* Cell 1: Video Publishing */}
        <div className="p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-foreground hover:bg-surface-hover transition-colors">
          <div className="mb-6 text-brand-primary">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold mb-3">Video & Photo</h3>
          <p className="font-serif text-sm text-foreground/70 leading-relaxed">
            Whether it&apos;s a quick 15-second clip, a 10-minute vlog, or a
            static photo update, our publisher handles every format natively.
          </p>
        </div>

        {/* Cell 2: Mega Carousels */}
        <div className="p-8 border-b-2 md:border-r-2 lg:border-b-0 border-foreground hover:bg-surface-hover transition-colors">
          <div className="mb-6 text-brand-primary">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold mb-3">Mega Carousels</h3>
          <p className="font-serif text-sm text-foreground/70 leading-relaxed">
            Tell a longer story. We support photo carousels with up to{" "}
            <strong>35 images</strong> per post. Perfect for photo dumps and
            tutorials.
          </p>
        </div>

        {/* Cell 3: Intelligent Processing */}
        <div className="p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-foreground hover:bg-surface-hover transition-colors">
          <div className="mb-6 text-brand-primary">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold mb-3">Smart Upload</h3>
          <p className="font-serif text-sm text-foreground/70 leading-relaxed">
            We handle the heavy lifting. Large video files are automatically
            chunked and optimized for smooth playback without quality loss.
          </p>
        </div>

        {/* Cell 4: Privacy */}
        <div className="p-8 hover:bg-surface-hover transition-colors">
          <div className="mb-6 text-brand-primary">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold mb-3">
            Privacy Control
          </h3>
          <p className="font-serif text-sm text-foreground/70 leading-relaxed">
            Your stage, your rules. Set visibility to Public, Friends, or
            Private. Disable duets or comments before you even post.
          </p>
        </div>
      </div>
    </section>
  );
}
