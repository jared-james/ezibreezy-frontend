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
          <span className="hidden text-foreground/60 sm:block"></span>

          {/* w-full on mobile to justify content, auto on desktop */}
          <div className="flex w-full items-center justify-end gap-4 sm:w-auto md:gap-6">
            <Link
              href="/"
              className="px-2 py-0.5 transition-colors hover:bg-foreground hover:text-background-editorial"
            >
              Home
            </Link>
            <Link
              href="/tools"
              className="px-2 py-0.5 transition-colors hover:bg-foreground hover:text-background-editorial"
            >
              Tools
            </Link>
            <Link
              href="/editorial"
              className="px-2 py-0.5 transition-colors hover:bg-foreground hover:text-background-editorial"
            >
              Editorial
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
      </div>
    </header>
  );
}
