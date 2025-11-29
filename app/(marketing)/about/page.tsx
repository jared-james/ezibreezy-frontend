import { Metadata } from "next";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import { WebPageJsonLd } from "@/components/seo/json-ld";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About EziBreezy | The Editorial Desk for Creators",
  description:
    "We are building the operating system for modern publishers. Learn why we moved away from spreadsheets to build a visual, editorial-first scheduling tool.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About EziBreezy",
    description: "The story behind the editorial desk for social media.",
    url: "https://www.ezibreezy.com/about",
    siteName: "EziBreezy",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "The EziBreezy Team",
      },
    ],
    type: "website",
  },
};

export default function AboutPage() {
  // Organization Schema to establish Entity Identity with Google
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EziBreezy",
    url: "https://www.ezibreezy.com",
    logo: "https://www.ezibreezy.com/icon.png",
    sameAs: [
      "https://twitter.com/ezibreezy_app",
      "https://www.instagram.com/ezibreezy_app",
      "https://www.linkedin.com/company/ezibreezy",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@ezibreezy.com",
      contactType: "customer support",
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif">
      <WebPageJsonLd
        title="About EziBreezy"
        description="We are building the operating system for modern publishers."
        url="https://www.ezibreezy.com/about"
      />

      {/* Inject Organization Schema manually since it's specific to this page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <LandingPageHeader />

      <main className="grow">
        <div className="relative mx-auto w-full max-w-4xl px-6 py-24">
          <div className="text-center mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-primary mb-4">
              Our Mission
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Social media shouldn't feel like a second job.
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 font-serif leading-relaxed max-w-2xl mx-auto">
              We help you think through what you want to say, capture it
              quickly, and turn it into posts without the chaos of spreadsheets.
            </p>
          </div>

          <div className="prose prose-lg prose-stone mx-auto font-serif">
            <p>
              The tools available to creators today are built for{" "}
              <em>scheduling</em>, not <strong>creating</strong>. They assume
              you already have the image, the caption, and the strategy ready to
              go.
            </p>
            <p>
              But the hard part isn't picking a time slot—it's the messy process
              before that. The ideation. The drafting. The visual planning.
            </p>
            <p>
              That is why we built EziBreezy. It is not just a scheduler; it is
              an
              <strong>Editorial Desk</strong>. A workspace designed to respect
              the creative process while giving you the power of a publishing
              house.
            </p>

            <div className="my-12 p-8 border-l-4 border-brand-primary bg-surface italic text-xl">
              "We believe that high-quality content comes from clarity, not
              chaos. Our tools are designed to give you that clarity."
            </div>

            <h3>What we stand for</h3>
            <ul>
              <li>
                <strong>Visual First:</strong> You can't plan a grid in a
                spreadsheet.
              </li>
              <li>
                <strong>No algorithm chasing:</strong> We build for consistency
                and quality, not "hacks".
              </li>
              <li>
                <strong>Open Access:</strong> Our utilities (like the Grid
                Planner) are free because we believe basic tools shouldn't be
                paywalled.
              </li>
            </ul>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
