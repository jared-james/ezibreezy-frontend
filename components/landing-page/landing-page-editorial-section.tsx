// components/landing-page/landing-page-editorial-section.tsx

export default function LandingPageEditorialSection() {
  return (
    <section className="bg-background px-6 py-20">
      <div className="mx-auto w-full max-w-6xl border-t-2 border-foreground">
        <div className="grid gap-10 md:gap-16 pt-16 md:grid-cols-[2fr,3fr]">
          <div className="flex flex-col justify-between">
            <div>
              <p className="eyebrow mb-4">PHILOSOPHY</p>

              <h2 className="headline mb-6">
                Marketing and building a brand is hard.
              </h2>

              <p className="subheadline mb-6 max-w-xl">
                EziBreezi makes it easier to think through what you want to say,
                capture it quickly, and turn it into posts without social
                feeling like a second or third full-time job.
              </p>

              <ul className="article-body space-y-4">
                <li className="flex gap-2">
                  <span className="mt-[2px] text-lg leading-none">❝</span>
                  <p>
                    Switching into content mode while running a business is
                    hard. We need ideas worth creating, not hours lost trying to
                    force the right headspace.
                  </p>
                </li>

                <li className="flex gap-2">
                  <span className="mt-[2px] text-lg leading-none">❝</span>
                  <p>
                    Consistency becomes easier when the ideas are already there
                    and the workflow supports posting without slowing you down.
                  </p>
                </li>

                <li className="flex gap-2">
                  <span className="mt-[2px] text-lg leading-none">❝</span>
                  <p>
                    Value comes from ideas that align with your goals and your
                    audience. When the thinking is sharp, the content is
                    meaningful.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
