// app/(marketing)/editorial/_posts/taste-is-the-moat.tsx

export const metadata = {
  slug: "taste-is-the-moat",
  title: "Taste is the Only Moat",
  excerpt:
    "In an age of infinite AI generation, curation becomes the primary value driver.",
  publishedAt: "2025-12-02",
};

export default function Post() {
  return (
    <>
      <p className="lead text-xl md:text-2xl font-serif leading-relaxed mb-8">
        AI has democratized competence. Anyone can generate a grammatically
        correct article or a reasonably composed image in seconds. The floor has
        been raised, but the ceiling hasn't moved.
      </p>
      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        The Curation Economy
      </h2>
      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        When content is infinite, the filter becomes more valuable than the
        source. Your audience doesn't follow you for information anymore;
        information is free. They follow you for your *selection*.
      </p>
      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        They follow you because you know what *not* to post. Taste cannot be
        prompted.
      </p>
    </>
  );
}
