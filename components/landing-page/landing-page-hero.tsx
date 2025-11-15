// components/landing-page/landing-page-hero.tsx

import Image from "next/image";

export default function LandingPageHero() {
  return (
    <section className="bg-[--background] px-4 py-4">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative mx-auto mb-8 h-64 w-full max-w-md md:h-[28rem]">
          <Image
            src="/background_logo_02.webp"
            alt="Featured illustration for EziBreezy"
            fill
            className="object-contain opacity-80 grayscale"
            style={{ filter: "contrast(1.2)" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
