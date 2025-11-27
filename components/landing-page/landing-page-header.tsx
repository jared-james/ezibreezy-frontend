// components/landing-page/landing-page-header.tsx

import Link from "next/link";

export default function LandingPageHeader() {
  return (
    <header className="relative bg-background-editorial text-foreground px-6 pt-8 md:pt-12 overflow-hidden">
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
        <div className="mb-8 flex items-center justify-between border-b-2 border-foreground pb-2 text-[10px] font-mono uppercase tracking-widest md:text-xs">
          <span className="text-foreground/60">
            System Status: In Development
          </span>

          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/auth/login"
              className="px-2 py-0.5 transition-colors hover:bg-foreground hover:text-background-editorial"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="font-bold underline decoration-2 underline-offset-4 hover:text-foreground/70"
            >
              Get Early Access
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 border-b-4 border-double border-foreground pb-6 md:flex-row md:items-end">
          <div className="flex-1">
            <p className="eyebrow mb-2 font-bold tracking-[0.25em]">
              The Daily Dispatch
            </p>

            <h1 className="mt-[-0.05em] font-serif text-6xl font-black uppercase leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl">
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

            <div className="mt-1 flex items-center gap-2">
              <span className="border border-foreground px-2 py-0.5">
                Est. 2025
              </span>

              {/* GREEN BADGE */}
              <span className="border border-foreground bg-brand-primary text-brand-primary-foreground px-2 py-0.5 font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                Late Edition
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
