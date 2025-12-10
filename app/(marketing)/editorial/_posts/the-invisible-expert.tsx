// app/(marketing)/editorial/_posts/the-invisible-expert.tsx

export const metadata = {
  slug: "the-invisible-expert",
  title: "The Invisible Expert",
  excerpt:
    "You are doing the work, but nobody knows. How to turn daily output into a content engine.",
  publishedAt: "2025-12-10",
};

export default function Post() {
  return (
    <>
      <p className="lead text-xl md:text-2xl font-serif leading-relaxed mb-8">
        <span className="float-left text-6xl font-black mr-3 mt-[-10px] font-serif">
          Y
        </span>
        ou solve complex problems all day. You write detailed specs, you debug
        intricate systems, you navigate client politics. Then, when it's time to
        post on LinkedIn, you stare at a blank page.
      </p>
      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        Document, Don't Create
      </h2>
      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        The best content isn't "thought leadership" drafted in a vacuum. It is
        the exhaust fumes of your actual work. It is the Slack message you sent
        explaining a decision. It is the screenshot of the design before it was
        polished.
      </p>
      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Stop trying to be an influencer. Start being a reporter on your own
        career.
      </p>
    </>
  );
}
