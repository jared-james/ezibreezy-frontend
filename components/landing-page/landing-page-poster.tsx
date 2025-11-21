// components/landing-page/landing-page-poster.tsx

import Image from "next/image";

export default function LandingPagePoster() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="w-full border-t-2 border-foreground mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="relative mx-auto w-full max-w-md h-64 md:h-80">
            <Image
              src="/background_logo_02.png"
              alt="Vintage-style illustration"
              fill
              className="object-contain grayscale opacity-80"
              style={{ filter: "contrast(1.2)" }}
            />
            <p className="mt-4 text-center font-serif text-xs italic text-muted-foreground">
              A simple idea deserves a beautiful execution.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4 text-center md:text-left">
              Editorial Note
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6 text-center md:text-left tracking-tight">
              Modern Scheduling <br /> & Content Timing
            </h2>

            <p className="article-body max-w-md">
              Know exactly when to post across every platform. Your calendar
              adapts to peak performance windows, audience patterns, and
              consistency goals, ensuring your work lands when it matters most.
            </p>
          </div>
        </div>

        <div className="border-b-4 border-double border-foreground mt-16" />
      </div>
    </section>
  );
}
