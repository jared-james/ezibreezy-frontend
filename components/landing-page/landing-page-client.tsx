// components/landing-page/landing-page-client.tsx

"use client";

import LandingPageEditorialSection from "./landing-page-editorial-section";
import MinimalHeader from "@/components/shared/minimal-header";
import LandingPageHero from "./landing-page-hero";
import LandingPageSpotlight from "./landing-page-spotlight";
import LandingPagePoster from "./landing-page-poster";
import LandingPageCTA from "./landing-page-cta";
import LandingPagePricing from "./landing-page-pricing"; // Import added
import LandingPageFooter from "./landing-page-footer";

export default function LandingPageClient() {
  return (
    <main>
      <MinimalHeader />
      <LandingPageHero />
      <LandingPageEditorialSection />
      <LandingPageSpotlight />
      <LandingPagePoster />
      <LandingPagePricing />
      <LandingPageCTA />
      <LandingPageFooter />
    </main>
  );
}
