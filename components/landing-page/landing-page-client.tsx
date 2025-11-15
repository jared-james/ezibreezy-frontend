// components/landing-page/landing-page-client.tsx

"use client";

import LandingPageEditorialSection from "./landing-page-editorial-section";
import LandingPageHeader from "./landing-page-header";
import LandingPageHero from "./landing-page-hero";
import LandingPageSpotlight from "./landing-page-spotlight";
import LandingPagePoster from "./landing-page-poster";
import LandingPageFooter from "./landing-page-footer";

export default function LandingPageClient() {
  return (
    <main>
      <LandingPageHeader />
      <LandingPageHero />
      <LandingPageEditorialSection />
      <LandingPageSpotlight />
      <LandingPagePoster />
      <LandingPageFooter />
    </main>
  );
}
