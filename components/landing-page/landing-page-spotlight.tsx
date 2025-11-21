// components/landing-page/landing-page-spotlight.tsx

export default function LandingPageSpotlight() {
  const spotlights = [
    {
      number: "01",
      title: "Idea generation",
      description:
        "Switching context is the enemy of good writing. Capture raw thoughts and daily moments quickly. Personalized AI that understands your voice turns them into content without the pressure of a blank page.",
      logo: "/logo_idea.webp",
    },
    {
      number: "02",
      title: "Publish everywhere",
      description:
        "Distribution shouldn't feel like administrative work. Create your message once and reach every platform instantly, keeping your focus on the story rather than the logistics.",
      logo: "/logo_cross_post.png",
    },
    {
      number: "03",
      title: "Visual calendar",
      description:
        "Consistency relies on clarity, not willpower. See your strategy at a glance and manage your time effortlessly, so you can stay visible without the daily scramble.",
      logo: "/logo_cal.webp",
    },
    {
      number: "04",
      title: "Media library",
      description:
        "Great creative deserves a home, not a downloads folder. Keep your visual assets organized and ready, so when inspiration strikes, you aren't wasting time searching for files.",
      logo: "/logo_smile.webp",
    },
    {
      number: "05",
      title: "Analytics",
      description:
        "Growth isn't about guessing. Get clear, honest insights into what connects with real people, helping you understand your impact without getting lost in the noise.",
      logo: "/logo_analytics.webp",
    },
  ];

  return (
    <section className="bg-background px-6 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        {/* Masthead */}
        <div className="border-y border-foreground py-8 mb-20">
          <div className="text-center">
            <h1 className="font-serif text-5xl md:text-7xl tracking-tight mb-2">
              TLDR Feature List
            </h1>
            <p className="eyebrow">Social Media Management · Est. 2024</p>
          </div>
        </div>

        {/* Features - Newspaper Column Layout */}
        <div className="space-y-16">
          {spotlights.map((spotlight) => (
            <article
              key={spotlight.number}
              className="border-t border-foreground pt-6"
            >
              {/* Header */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="eyebrow opacity-60">
                  No. {spotlight.number}
                </span>
                <div className="flex-1 h-px bg-foreground opacity-20" />
                <span className="eyebrow uppercase">{spotlight.title}</span>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8 md:gap-12">
                {/* Left: Content */}
                <div>
                  <h2 className="headline text-4xl md:text-5xl mb-6">
                    {spotlight.title}
                  </h2>
                  <p className="article-body text-base md:text-lg leading-relaxed max-w-xl">
                    {spotlight.description}
                  </p>
                </div>

                {/* Right: Image Box */}
                <div className="relative">
                  <div className="aspect-square border border-foreground relative overflow-hidden bg-background">
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-foreground" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-foreground" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-foreground" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-foreground" />

                    {/* Icon - Subtle Opacity */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <img
                        src={spotlight.logo}
                        alt=""
                        className="w-32 h-32 md:w-40 md:h-40 object-contain opacity-15"
                      />
                    </div>

                    {/* Coming Soon Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="eyebrow text-muted-foreground">
                        Image Coming Soon
                      </p>
                    </div>

                    {/* Caption Bar */}
                    <div className="absolute bottom-0 inset-x-0 border-t border-foreground bg-background/95 backdrop-blur-sm py-2 px-3">
                      <p className="byline text-center">
                        Feature {spotlight.number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
