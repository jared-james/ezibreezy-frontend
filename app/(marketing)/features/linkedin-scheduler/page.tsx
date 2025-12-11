// app/(marketing)/features/linkedin-scheduler/page.tsx

import { Metadata } from "next";
import {
  Users,
  Monitor,
  Globe,
  BarChart3,
  TrendingUp,
  Crop,
  Type,
  CheckCircle2,
  Image as ImageIcon,
  Eye,
  Sparkles,
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
import { LinkedInHeroVisual, LinkedInInboxVisual } from "./visuals";

export const metadata: Metadata = {
  title: "LinkedIn Scheduler | Articles, Carousels & Analytics",
  description:
    "The professional workspace for LinkedIn. Schedule PDF carousels, format articles, tag companies, and track visitor demographics.",
  alternates: {
    canonical: "/features/linkedin-scheduler",
  },
  openGraph: {
    title: "LinkedIn Scheduler | EziBreezy",
    description:
      "The professional workspace. Schedule, format, analyze, and engage.",
    url: "https://www.ezibreezy.com/features/linkedin-scheduler",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "EziBreezy LinkedIn Scheduler",
      },
    ],
    type: "website",
  },
};

export default function LinkedInSchedulerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif selection:bg-brand-primary/20">
      <WebPageJsonLd
        title="LinkedIn Scheduler | Articles, Carousels & Analytics"
        description="The professional workspace for LinkedIn. Schedule PDF carousels, format articles, tag companies, and track visitor demographics."
        url="https://www.ezibreezy.com/features/linkedin-scheduler"
      />
      <SoftwareApplicationJsonLd
        name="EziBreezy LinkedIn Scheduler"
        applicationCategory="BusinessApplication"
        price="25"
        currency="USD"
      />

      <LandingPageHeader />

      <main className="grow w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-24">
        <FeatureMasthead
          title="LinkedIn"
          headline="Your professional voice."
          subheadline="Clear, consistent, and heard."
        />

        <FeatureHero
          headline={
            <>
              Give your expertise
              <br />
              <span className="italic font-normal">a place to shine.</span>
            </>
          }
          copy={
            <>
              <p>
                <span className="float-left text-5xl font-black mr-3 -mt-2">
                  Y
                </span>
                ou have insights that your industry needs to hear. The challenge
                isn&apos;t having the ideas; it&apos;s getting them out there
                consistently.
              </p>
              <p>
                The <strong>Editorial Desk</strong> supports your workflow.
                Whether you are sharing a quick text update, a detailed
                carousel, or a video insight, we provide the tools to format,
                preview, and publish your best work with confidence.
              </p>
            </>
          }
          ctaText="Draft Your Article"
          ctaLink="/auth/signup"
          figLabel="Fig 2. The Carousel"
          visual={<LinkedInHeroVisual />}
        />

        <MarketIntelligence
          leadTitle={
            <>
              Understand your
              <br />
              <span className="italic text-brand-primary">impact.</span>
            </>
          }
          leadCopy={
            <>
              <p>
                Data helps you serve your audience better. It tells you what
                resonates, who is listening, and where your message is
                traveling.
              </p>
              <p className="text-sm text-foreground/70">
                Our intelligence report gives you a clear view of your
                professional footprint, so you can focus on creating content
                that truly connects.
              </p>
            </>
          }
          metrics={[
            {
              icon: Users,
              label: "Followers",
              sublabel: "Growth Tracking",
              description:
                "Track new connections. See how many followers you have gained over time.",
            },
            {
              icon: Users, // Fallback, replaced by customIcon
              customIcon: (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
              ),
              label: "Demographics",
              sublabel: "Visitor Profile",
              description:
                "See the job titles, industries, and regions of the people visiting your page.",
            },
            {
              icon: Monitor,
              label: "Page Views",
              sublabel: "Traffic Sources",
              description:
                "See total views broken down by mobile and desktop devices.",
            },
            {
              icon: Globe,
              label: "Visitors",
              sublabel: "Page Traffic",
              description:
                "See exactly how many people are visiting your profile or company page.",
            },
            {
              icon: BarChart3,
              label: "Shares",
              sublabel: "Network Effect",
              description:
                "Track how often your insights are being shared by others in the network.",
            },
            {
              icon: TrendingUp,
              label: "Post Insights",
              sublabel: "Engagement",
              description:
                "Break down specific posts by impressions, clicks, comments, and reactions.",
            },
          ]}
        />

        <SocialInbox
          description={
            <p>
              Our <strong>Social Inbox</strong> brings every comment into one
              organized stream. Receive and reply to post comments efficiently,
              ensuring every person who engages with your work feels heard and
              acknowledged.
            </p>
          }
          visual={<LinkedInInboxVisual />}
        />

        <TechnicalLedger
          subtitle="Publishing Capabilities"
          items={[
            {
              icon: Crop,
              title: "Image Cropping",
              description:
                "Crop your visuals directly in the editor. Choose from Square, Landscape, Portrait, or Story ratios.",
            },
            {
              icon: Type,
              title: "Text-Only Posts",
              description:
                "Sometimes words are enough. Publish text-only updates formatted with clarity to spark discussion.",
            },
            {
              icon: CheckCircle2,
              title: "Carousel Publishing",
              description:
                "Tell a deeper story. Publish carousels with up to 9 images or videos to keep your audience engaged longer.",
            },
            {
              icon: ImageIcon,
              title: "Image & Video",
              description:
                "Support for high-quality single image and video posts. We handle the optimization so your content looks crisp.",
            },
            {
              icon: CheckCircle2,
              title: "Accessibility",
              description:
                "Add descriptive Alt Text to your images. Ensure your insights are accessible to everyone in your network.",
            },
            {
              icon: CheckCircle2,
              title: "Tag Pages",
              description:
                "Give credit where it is due. Tag other LinkedIn company pages by simply typing @ to expand your reach.",
            },
            {
              icon: Eye,
              title: "Post Preview",
              description:
                "See exactly how your post will look in the feed before you publish. No formatting surprises.",
            },
          ]}
        />

        <UtilityDrawer
          tools={[
            {
              icon: Type,
              title: "Text Formatter",
              description:
                "Add emphasis to your professional updates. Generate bold & italic text for headers.",
              href: "/tools/linkedin-text-formatter",
              decoration: "corner",
            },
            {
              icon: Crop,
              title: "Image Resizer",
              description:
                "Don't get cropped out. Resize your images specifically for the LinkedIn feed (1.91:1).",
              href: "/tools/social-image-resizer",
            },
          ]}
        />

        <FeatureCTA
          icon={Sparkles}
          titlePrefix="Schedule your"
          titleHighlight="expertise."
          description="The editorial desk is open. Map out your professional insights, format your articles, and build your authority."
          issueNumber="03"
          editionName="Professional Edition"
        />
      </main>

      <LandingPageFooter />
    </div>
  );
}
