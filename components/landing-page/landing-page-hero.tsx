// components/landing-page/landing-page-hero.tsx

import HeroContent from "./hero-content";
import PressPassCard from "./press-pass-card";

export default function LandingPageHero() {
  return (
    <section className="relative w-full bg-background-editorial text-foreground overflow-hidden ">
      {/* Background Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 md:pb-32">
        {/* HERO TITLE SECTION */}
        <div className="flex flex-col justify-between gap-6 border-b-4 border-double border-foreground pb-6 mb-12 md:flex-row md:items-end">
          <div className="flex-1">
            <p className="eyebrow mb-2 font-bold tracking-[0.25em]">
              The Daily Dispatch
            </p>

            {/* Mobile text size adjusted to 5xl to prevent overflow */}
            <h1 className="mt-[-0.05em] font-serif text-5xl font-black uppercase leading-[0.85] tracking-tighter sm:text-6xl md:text-8xl lg:text-9xl">
              EziBreezy
            </h1>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-1.5 pb-1 font-mono text-xs uppercase tracking-wider md:items-end">
            <div className="flex items-center gap-2">
              <span>Vol. 01</span>
              <span className="h-3 w-px bg-foreground/30" />
              <span>Issue 01</span>
            </div>

            <span>Forecast: Creative Flow</span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <HeroContent />
          <PressPassCard />
        </div>
      </div>
    </section>
  );
}
