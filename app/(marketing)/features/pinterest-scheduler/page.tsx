// app/(marketing)/features/pinterest-scheduler/page.tsx

import { Metadata } from "next";
import {
  MousePointer2,
  Bookmark,
  Eye,
  Users,
  Layout,
  Sparkles,
  Pin,
  Link as LinkIcon,
  CheckCircle2,
  Video,
  Type,
  Image as ImageIcon,
  Crop,
} from "lucide-react";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import {
  SoftwareApplicationJsonLd,
  WebPageJsonLd,
} from "@/components/seo/json-ld";

// Shared Feature Components
import FeatureMasthead from "../feature-masthead";
import FeatureHero from "../feature-hero";
import MarketIntelligence from "../market-intelligence";
import SocialInbox from "../social-inbox";
import TechnicalLedger from "../technical-ledger";
import UtilityDrawer from "../utility-drawer";
import FeatureCTA from "../feature-cta";

// Local Visuals
import { PinterestHeroVisual, PinterestInboxVisual } from "./visuals";

export const metadata: Metadata = {
  title: "Pinterest Scheduler | Board Management & Pin Planner",
  description:
    "The visual workspace for Pinterest. Schedule Pins, manage Boards, and drive long-tail traffic from one editorial desk.",
  alternates: {
    canonical: "/features/pinterest-scheduler",
  },
  openGraph: {
    title: "Pinterest Scheduler | EziBreezy",
    description: "The curator's archive. Schedule, organize, and inspire.",
    url: "https://www.ezibreezy.com/features/pinterest-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy Pinterest Scheduler",
      },
    ],
    type: "website",
  },
};

export default function PinterestSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="Pinterest Scheduler | Board Management & Pin Planner"
        description="The visual workspace for Pinterest. Schedule Pins, manage Boards, and drive long-tail traffic."
        url="https://www.ezibreezy.com/features/pinterest-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy Pinterest Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        <FeatureMasthead
          title="Pinterest"
          headline="The visual archive."
          subheadline="Where ideas find their home."
        />

        <FeatureHero
          headline={
            <>
              Curate your
              <br />
              <span className="italic font-normal">legacy.</span>
            </>
          }
          copy={
            <>
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  O
                </span>
                ther platforms are about <em>now</em>. Pinterest is about{" "}
                <em>next</em>. It is where people go to plan their futures, not
                just scroll through their present.
              </p>
              <p>
                The <strong>Editorial Desk</strong> helps you build a library
                that lasts. Organize your inspiration, schedule your pins, and
                create a resource that people will return to for years to come.
              </p>
            </>
          }
          ctaText="Build Your Archive"
          ctaLink="/auth/signup"
          visual={<PinterestHeroVisual />}
        />

        <MarketIntelligence
          leadTitle={
            <>
              Map the
              <br />
              <span className="italic text-brand-primary">intent.</span>
            </>
          }
          leadCopy={
            <>
              <p>
                A Pin isn&apos;t just an image; it&apos;s a bookmark for a
                future action. Analytics on Pinterest reveal what your audience
                is planning to do.
              </p>
              <p className="text-sm text-foreground/70">
                Understand which ideas are resonating and which visuals are
                driving people off the platform and onto your site.
              </p>
            </>
          }
          metrics={[
            {
              icon: MousePointer2,
              label: "Outbound Clicks",
              sublabel: "Traffic",
              description:
                "The most valuable metric. See how many people are leaving Pinterest to visit your website.",
            },
            {
              icon: Bookmark,
              label: "Saves",
              sublabel: "Intent",
              description:
                "The digital equivalent of tearing a page from a magazine. See what people are keeping.",
            },
            {
              icon: Eye,
              label: "Impressions",
              sublabel: "Discovery",
              description:
                "See how often your Pins are appearing in search results and home feeds.",
            },
            {
              icon: Users,
              label: "Total Audience",
              sublabel: "Reach",
              description:
                "The total number of unique people who have seen or engaged with your Pins.",
            },
            {
              icon: Layout,
              label: "Top Boards",
              sublabel: "Curation",
              description:
                "Identify which of your collections are performing best and attracting the most attention.",
            },
            {
              icon: Sparkles,
              label: "Engaged Audience",
              sublabel: "Action",
              description:
                "The number of people who interacted with your Pins (clicks, saves, reactions).",
            },
          ]}
        />

        <SocialInbox
          description={
            <p>
              Our <strong>Social Inbox</strong> keeps track of comments and
              &quot;tries&quot; on your Pins, so you can encourage your
              community and see the real-world impact of your curation.
            </p>
          }
          visual={<PinterestInboxVisual />}
        />

        <TechnicalLedger
          subtitle="Curation Capabilities"
          items={[
            {
              icon: Users,
              title: "Accounts",
              description:
                "Manage multiple identities. Connect any Pinterest account and switch between client portfolios instantly.",
            },
            {
              icon: Pin,
              title: "Direct Scheduling",
              description:
                "Set it and forget it. Schedule Pins to go live at specific times to capture your audience.",
            },
            {
              icon: Layout,
              title: "Board Organization",
              description:
                "Create new Boards directly from the composer. Ensure every Pin finds its perfect home.",
            },
            {
              icon: LinkIcon,
              title: "Destination Links",
              description:
                "Drive traffic where it matters. Add destination URLs to every Pin.",
            },
            {
              icon: CheckCircle2,
              title: "Accessible Features",
              description:
                "Add descriptive Alt Text to your scheduled images. Improve SEO discovery.",
            },
            {
              icon: Video,
              title: "Video Pins",
              description:
                "Motion grabs attention. Upload video Pins with custom covers to stand out in a static feed.",
            },
            {
              icon: Type,
              title: "Rich Details",
              description:
                "Add keyword-rich titles and descriptions (up to 500 chars) to ensure your content is found.",
            },
            {
              icon: ImageIcon,
              title: "Visual Fidelity",
              description:
                "We support high-resolution uploads. Your visuals are the product; we ensure they look pristine.",
            },
          ]}
        />

        <UtilityDrawer
          tools={[
            {
              icon: Crop,
              title: "Image Resizer",
              description:
                "Crop perfectly for Pinterest (2:3). Ensure your vertical visuals aren't cut off in the feed.",
              href: "/tools/social-image-resizer",
              decoration: "corner",
            },
            {
              icon: Sparkles,
              title: "Screenshot Studio",
              description:
                "Turn browser screenshots into aesthetic Pin graphics instantly. Add backgrounds and shadows.",
              href: "/tools/screenshot-studio",
            },
          ]}
        />

        <FeatureCTA
          icon={Sparkles}
          titlePrefix="Organize your"
          titleHighlight="inspiration."
          description="The editorial desk is open. Curate your boards, schedule your vision, and build your archive."
          issueNumber="08"
          editionName="Curation Edition"
        />
      </main>

      <LandingPageFooter />
    </div>
  );
}
