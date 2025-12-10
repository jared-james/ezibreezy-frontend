// app/(marketing)/editorial/_posts/context-switching-is-poison.tsx

export const metadata = {
  slug: "context-switching-is-poison",
  title: "Context Switching is Poison",
  excerpt:
    "Why bouncing between Slack, Canva, and your scheduler is costing you 40% of your productive hours.",
  publishedAt: "2025-11-20",
};

export default function Post() {
  return (
    <>
      <p className="lead text-xl md:text-2xl font-serif leading-relaxed mb-8">
        <span className="float-left text-6xl font-black mr-3 mt-[-10px] font-serif">
          T
        </span>
        here is a myth that creators are multitaskers. We pride ourselves on
        having thirty tabs open, editing a reel while answering an email and
        scheduling a tweet.
      </p>
      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        The Cost of the Toggle
      </h2>
      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Every time you Alt-Tab from your writing buffer to check an analytic
        dashboard, you pay a "resume tax." It takes an average of 23 minutes to
        return to a state of deep flow after an interruption.
      </p>
      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        We built the Editorial Desk not to add another tool, but to remove the
        need to leave. Write, visualize, and dispatch in one single,
        uninterrupted motion.
      </p>
    </>
  );
}
