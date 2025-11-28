// components/landing-page/landing-page-header.tsx

import Link from "next/link";

export default function LandingPageHeader() {
  return (
    <header className="relative bg-background-editorial text-foreground px-4 pt-8 md:px-6 md:pt-12 overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* TOP BAR */}
        <div className="mb-8 flex items-center justify-between border-b-2 border-foreground pb-2 text-[10px] font-mono uppercase tracking-widest md:text-xs">
          {/* Hidden on small screens (mobile) to give space to the Buttons */}
          <span className="hidden text-foreground/60 sm:block">
            System Status: In Development
          </span>

          {/* w-full on mobile to justify content, auto on desktop */}
          <div className="flex w-full items-center justify-end gap-4 sm:w-auto md:gap-6">
            <Link
              href="/tools"
              className="px-2 py-0.5 transition-colors hover:bg-foreground hover:text-background-editorial"
            >
              Tools
            </Link>
            <Link
              href="/auth/login"
              className="px-2 py-0.5 transition-colors hover:bg-foreground hover:text-background-editorial"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              // whitespace-nowrap keeps "Get Early Access" on one line
              className="whitespace-nowrap font-bold underline decoration-2 underline-offset-4 hover:text-foreground/70"
            >
              Get Early Access
            </Link>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="flex flex-col justify-between gap-6 border-b-4 border-double border-foreground pb-6 md:flex-row md:items-end">
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
      </div>
    </header>
  );
}
