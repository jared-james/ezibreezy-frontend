// components/landing-page/landing-page-poster.tsx

import Image from "next/image";

export default function LandingPagePoster() {
  return (
    <section className="bg-[--background] px-4 py-20">
      <div className="mx-auto w-full max-w-5xl">
        {/* TOP LINE — matches header + footer */}
        <div className="w-full border-t-2 border-[--foreground] mb-12" />

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* LEFT — IMAGE */}
          <div className="relative mx-auto w-full max-w-md h-64 md:h-80">
            <Image
              src="/background_logo_02.png"
              alt="Vintage-style illustration"
              fill
              className="object-contain grayscale opacity-80"
              style={{ filter: "contrast(1.2)" }}
            />
            <p className="mt-4 text-center font-serif text-xs italic text-[--muted-foreground]">
              A simple idea deserves a beautiful execution.
            </p>
          </div>

          {/* RIGHT — TEXT */}
          <div>
            {/* Eyebrow — same style as header's small serif text */}
            <p className="text-xs uppercase tracking-[0.15em] text-[--muted-foreground] mb-3 font-serif text-center md:text-left">
              Editorial Note
            </p>

            {/* Big serif heading — matches hero and newspaper masthead tone */}
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-4 text-center md:text-left tracking-tight">
              Modern Scheduling <br /> & Content Timing
            </h2>

            {/* Body copy — serif, balanced spacing */}
            <p className="font-serif text-base leading-relaxed text-[--foreground] max-w-md">
              Know exactly when to post across every platform. Your calendar
              adapts to peak performance windows, audience patterns, and
              consistency goals — ensuring your work lands when it matters most.
            </p>
          </div>
        </div>

        {/* BOTTOM DOUBLE-LINE — mirrors your masthead aesthetic */}
        <div className="border-b-4 border-double border-[--foreground] mt-12" />
      </div>
    </section>
  );
}
