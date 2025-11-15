// components/landing-page/landing-page-spotlight.tsx

export default function LandingPageSpotlight() {
  const spotlights = [
    {
      number: "01",
      title: "Onboarding",
      description:
        "Some copy about writing about who you are and your style etc",
      logo: "/logo_smile.webp",
    },
    {
      number: "02",
      title: "Idea generation",
      description: "Some copy about coming up with ideas",
      logo: "/logo_idea.webp",
    },
    {
      number: "03",
      title: "Cross-post to all social platforms",
      description:
        "Copy about cross posting to all social platforms in one layout, instagram feed etc",
      logo: "/logo_cross_post.png",
    },

    {
      number: "04",
      title: "Calendar",
      description: "Copy about the calender",
      logo: "/logo_cal.webp",
    },

    {
      number: "05",
      title: "Analytics",
      description: "something about analytics",
      logo: "/logo_analytics.webp",
    },
  ];

  return (
    <section className="bg-[--background] px-4 py-20">
      <div className="mx-auto w-full max-w-5xl space-y-24">
        {spotlights.map((spotlight) => (
          <div key={spotlight.number}>
            {/* EYEBROW — full width */}
            <div className="border-t-2 border-[--foreground] pt-3 text-xs uppercase tracking-[0.15em] text-[--muted-foreground] font-serif">
              No. {spotlight.number} — {spotlight.title}
            </div>

            {/* TITLE + DESCRIPTION */}
            <div className="mt-6 mb-10">
              <h2 className="mb-4 font-serif text-4xl md:text-5xl font-bold tracking-tight">
                {spotlight.title}
              </h2>

              <p className="font-serif text-[--foreground] max-w-2xl leading-relaxed text-base">
                {spotlight.description}
              </p>
            </div>

            {/* PRODUCT PREVIEW BOX — with logo positioned absolute */}
            <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] bg-[--background] border-2 border-double border-[--foreground] rounded-sm flex items-center justify-center">
              {/* LOGO - positioned in top-right corner */}
              <img
                src={spotlight.logo}
                alt=""
                className="absolute -top-12 -right-12 w-48 h-48 md:w-56 md:h-56 object-contain"
              />

              <span className="text-xs font-serif text-[--muted-foreground] uppercase tracking-[0.15em]">
                Product Preview {spotlight.number}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
