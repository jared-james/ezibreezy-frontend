// app/(marketing)/terms/page.tsx

import LandingPageFooter from "@/components/landing-page/landing-page-footer";
import LandingPageHeader from "@/components/landing-page/landing-page-header";

export default function TermsPage() {
  const sections = [
    {
      id: "acceptance-of-terms",
      title: "Acceptance of Terms",
      content: (
        <p className="article-body text-muted-foreground">
          By accessing and using the ezibreezy web application and services
          ("Service"), you agree to be bound by these Terms of Service ("Terms")
          and all terms, policies, and guidelines incorporated by reference. If
          you do not agree to all of these Terms, do not use the Service. These
          Terms govern your access to and use of the Service, and constitute a
          binding legal agreement between you and ezibreezy.
        </p>
      ),
    },
    {
      id: "service-description-and-ai-use",
      title: "Service Description & AI Generated Content",
      content: (
        <>
          <div className="space-y-6">
            <div className="pl-6 border-l-2 border-border/70">
              <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
                Content Generation
              </h4>
              <p className="article-body text-muted-foreground">
                The Service uses third-party Artificial Intelligence models
                (e.g., OpenAI, Gemini) to generate content ("AI Content") based
                on your inputs ("User Prompts"). We make no guarantees regarding
                the{" "}
                <span className="font-bold">
                  accuracy, suitability, or legality
                </span>{" "}
                of AI Content. You acknowledge that AI Content may require human
                review, editing, and fact-checking before publishing.
              </p>
            </div>
            <div className="pl-6 border-l-2 border-border/70">
              <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
                Publishing Service
              </h4>
              <p className="article-body text-muted-foreground">
                We act only as a tool to facilitate the scheduling and
                publishing of your content to third-party social media platforms
                (e.g., X/Twitter). You are solely responsible for all content
                published on your behalf, including adherence to the terms and
                policies of the target social media platform.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "user-content-and-licensing",
      title: "User Content, IP, and Licenses",
      content: (
        <>
          <div className="space-y-6">
            <div className="pl-6 border-l-2 border-border/70">
              <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
                Ownership
              </h4>
              <p className="article-body text-muted-foreground">
                You retain all rights and ownership of your User Prompts,
                original content, and the resulting AI Content and media you
                upload ("User Content").
              </p>
            </div>
            <div className="pl-6 border-l-2 border-border/70">
              <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
                Limited License to ezibreezy
              </h4>
              <p className="article-body text-muted-foreground">
                By using the Service, you grant ezibreezy a non-exclusive,
                worldwide, royalty-free license to use, reproduce, modify, and
                display your User Content{" "}
                <span className="font-bold">
                  solely for the purpose of operating, improving, and providing
                  the Service
                </span>{" "}
                (e.g., storing it as a draft, sending it to a social media
                platform, or using it to train our internal processes).
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "user-responsibilities",
      title: "User Responsibilities and Prohibitions",
      content: (
        <>
          <p className="article-body text-muted-foreground mb-4">
            You agree not to use the Service to upload, publish, or promote any
            content that is:
          </p>
          <div className="grid gap-4">
            {[
              "Illegal, fraudulent, or promotes illegal acts.",
              "Infringing on any third party's intellectual property rights or privacy rights.",
              "Harmful, threatening, abusive, harassing, defamatory, or hateful.",
              "In violation of the terms of service of any integrated social media platform.",
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
      id: "limitation-of-liability",
      title: "Disclaimer of Warranties & Limitation of Liability",
      content: (
        <>
          <div className="space-y-6">
            <div className="pl-6 border-l-2 border-border/70">
              <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
                Disclaimer
              </h4>
              <p className="article-body text-muted-foreground">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." WE EXPRESSLY
                DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED,
                INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT.
              </p>
            </div>
            <div className="pl-6 border-l-2 border-border/70">
              <h4 className="font-serif font-bold text-lg mb-2 text-foreground">
                Limitation of Liability
              </h4>
              <p className="article-body text-muted-foreground">
                IN NO EVENT SHALL EZIBREEZY BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS,
                DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF
                OR IN CONNECTION WITH YOUR USE OF THE SERVICE OR THE AI CONTENT
                GENERATED.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "termination",
      title: "Termination",
      content: (
        <p className="article-body text-muted-foreground">
          We may terminate or suspend your access to the Service immediately,
          without prior notice or liability, for any reason, including without
          limitation if you breach the Terms. You may cease using the Service
          and request account deletion at any time.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact Information",
      content: (
        <p className="article-body text-muted-foreground">
          For any questions regarding these Terms of Service, please contact us
          at:{" "}
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

  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingPageHeader />
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="dateline text-lg text-muted-foreground">
              Last Updated: November 21, 2025
            </p>
          </div>

          <div className="mb-16 p-8 rounded-lg bg-surface border border-border">
            <p className="article-body text-lg text-foreground leading-relaxed">
              Welcome to ezibreezy. These Terms of Service outline the rules and
              regulations for the use of ezibreezy's website and application.
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
