// components/landing-page/landing-page-poster.tsx

"use client";

import dynamic from "next/dynamic";

// Dynamic import to prevent hydration issues with DndContext
const InstagramGridBoard = dynamic(() => import("./instagram-grid"), {
  ssr: false,
});

export default function LandingPagePoster() {
  return (
    <section className="bg-background-editorial border-b border-foreground relative overflow-hidden">
      <div className="px-6 py-24 mx-auto w-full max-w-7xl relative z-0">
        {/* Centered Vertical Layout */}
        <div className="flex flex-col items-center justify-center text-center space-y-12">
          {/* Top Content: Title */}
          <div className="max-w-3xl mx-auto">
            <p className="eyebrow mb-6 text-brand-primary font-bold tracking-widest uppercase">
              The Final Word
            </p>

            <h2 className="font-serif text-5xl md:text-6xl font-black leading-[0.95] mb-4 tracking-tighter text-foreground">
              A workflow that respects your taste.
            </h2>
          </div>

          {/* Bottom Content: Interactive Grid Planner */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-md relative">
              {/* THE GRID COMPONENT */}
              <InstagramGridBoard />

              {/* Decoration under the board */}
              <div className="mt-4 flex justify-between items-center px-6 opacity-60">
                <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest text-foreground">
                  <span>Fig. 02</span>
                  <span>//</span>
                  <span>Grid_Preview</span>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-foreground">
                  DRAG_ME
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
