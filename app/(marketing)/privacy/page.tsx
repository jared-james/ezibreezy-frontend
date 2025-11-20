// app/(marketing)/privacy/page.tsx

import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import LandingPageHeader from "@/components/landing-page/landing-page-header";

// All icon imports and definitions have been removed as requested.

const sections = [
  {
    id: "information-collection",
    title: "Information We Collect",
    content: (
      <>
        <p className="article-body mb-6 text-muted-foreground">
          We collect information about you and your activity in the following
          ways to provide our content generation and publishing service:
        </p>
        <div className="space-y-6">
          <div className="pl-6 border-l-2 border-border/70">
            <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
              Personal and Account Data
            </h4>
            <p className="article-body text-muted-foreground">
              When you register, we collect your unique{" "}
              <span className="font-bold">User ID</span> (from Supabase),{" "}
              <span className="font-bold">email address</span>,{" "}
              <span className="font-bold">display name</span>, and information
              about the organizations you belong to and manage.
            </p>
          </div>
          <div className="pl-6 border-l-2 border-border/70">
            <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
              Content and AI Data
            </h4>
            <p className="article-body text-muted-foreground">
              We store the <span className="font-bold">raw text prompts</span>{" "}
              you submit to the AI Gateway and the resulting generated content
              (drafts, titles, and post bodies) to manage your content library.
            </p>
          </div>
          <div className="pl-6 border-l-2 border-border/70">
            <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
              Social Media Credentials
            </h4>
            <p className="article-body text-muted-foreground">
              If you connect a social media account (e.g., X/Twitter), we
              retrieve and store the required OAuth{" "}
              <span className="font-bold">access and refresh tokens</span>.
              These tokens are stored securely using strong encryption
              (AES-256-GCM). We also store public profile details (username,
              profile image).
            </p>
          </div>
          <div className="pl-6 border-l-2 border-border/70">
            <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
              Media and Publishing Data
            </h4>
            <p className="article-body text-muted-foreground">
              Uploaded media files (images, videos) are stored on our cloud
              storage (R2/S3), and we save the resulting links and file details
              in our database.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "use-of-information",
    title: "How We Use Your Information",
    content: (
      <>
        <p className="article-body mb-6 text-muted-foreground">
          Your information is primarily used to power the ezibreezy platform and
          deliver content:
        </p>
        <div className="grid gap-4">
          {[
            "To generate content drafts by sending your prompts to the configured AI provider (OpenAI/Gemini).",
            "To securely store your encrypted tokens and user settings for future publishing.",
            "To publish your scheduled content and media to the designated social media platforms at the specified time.",
            "To manage and maintain your content library (draft, scheduled, sent posts).",
            "To authenticate your identity (via Supabase) and manage your organizational permissions.",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <p className="article-body text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "disclosure-of-information",
    title: "Sharing Your Information",
    content: (
      <>
        <p className="article-body mb-6 text-muted-foreground">
          We do not sell your personal data. Information is only shared as
          necessary to operate the service:
        </p>
        <div className="space-y-6">
          <div className="pl-6 border-l-2 border-border/70">
            <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
              With External AI Services
            </h4>
            <p className="article-body text-muted-foreground">
              Your <span className="font-bold">text prompts</span> are
              transmitted to the configured AI provider (e.g., OpenAI, Gemini)
              to perform content generation.
            </p>
          </div>
          <div className="pl-6 border-l-2 border-border/70">
            <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
              With Social Media Platforms
            </h4>
            <p className="article-body text-muted-foreground">
              Your{" "}
              <span className="font-bold">
                post content, media, and publishing request
              </span>{" "}
              are transmitted to the relevant social media platform (e.g.,
              X/Twitter) using your encrypted tokens to fulfill your publishing
              command.
            </p>
          </div>
          <div className="pl-6 border-l-2 border-border/70">
            <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
              With Service Providers
            </h4>
            <p className="article-body text-muted-foreground">
              We share data with providers like Supabase (Auth), our database
              (Postgres/Drizzle), BullMQ (Scheduling), and cloud media storage
              (R2/S3) to host and operate the platform.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "data-security",
    title: "Data Security and Retention",
    content: (
      <p className="article-body text-muted-foreground">
        We prioritize data security. All sensitive credentials, such as{" "}
        <span className="font-bold">social media tokens</span>, are encrypted at
        rest. We store your data as long as your account is active to maintain
        your content library. You can delete your account at any time, which
        will permanently remove all personal data and content from our systems.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    content: (
      <p className="article-body text-muted-foreground">
        If you have any questions or comments about this Privacy Policy, please
        contact us at:{" "}
        <a
          href="mailto:support@ezibreezy.app" // Placeholder email
          className="text-brand-accent hover:text-brand-accent-hover underline underline-offset-4 font-bold transition-colors"
        >
          support@ezibreezy.app
        </a>
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingPageHeader />
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            {/* Removed icon wrapper div */}
            <h1 className="headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="dateline text-lg text-muted-foreground">
              Last Updated: November 21, 2025
            </p>
          </div>

          <div className="mb-16 p-8 rounded-lg bg-surface border border-border">
            <p className="article-body text-lg text-foreground leading-relaxed">
              Welcome to ezibreezy ("we," "us," or "our"). We are committed to
              protecting your privacy. This policy explains how we collect, use,
              and safeguard your information when you use our content generation
              and publishing application.
            </p>
          </div>

          <div className="space-y-16">
            {sections.map((section, index) => {
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <div className="flex items-start gap-4 mb-6">
                    {/* Removed Icon component and its container */}
                    <div className="flex-1">
                      <h2 className="font-serif font-bold text-2xl md:text-3xl text-foreground">
                        {index + 1}. {section.title}
                      </h2>
                    </div>
                  </div>
                  <div className="pl-4 sm:pl-16">{section.content}</div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <LandingPageFooter />
    </div>
  );
}
