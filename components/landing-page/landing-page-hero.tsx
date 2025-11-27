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

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-12 pb-24 md:pb-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <HeroContent />
          <PressPassCard />
        </div>
      </div>
    </section>
  );
}
