// app/(marketing)/editorial/_posts/visual-grid-manifesto.tsx

import { ReactNode } from "react";

export const metadata = {
  slug: "visual-grid-manifesto",
  title: "The Visual Grid Manifesto",
  excerpt:
    "Why we stopped planning in spreadsheets and started thinking in tiles.",
  publishedAt: "2025-10-12",
};

export default function Post() {
  return (
    <>
      <p className="lead text-xl md:text-2xl font-serif leading-relaxed mb-8">
        <span className="float-left text-6xl font-black mr-3 mt-[-10px] font-serif">
          W
        </span>
        e have all been there. Tab 4, Row 56. The content calendar. It is where
        creativity goes to die.
      </p>
      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        The Problem with Cells
      </h2>
      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Social media is inherently visual. Trying to plan a grid using text
        descriptions in a cell is like trying to paint a portrait over the
        phone. You lose the context of the whole.
      </p>
      <div className="my-12 p-6 border-l-4 border-brand-primary bg-surface-hover/50 italic font-serif text-xl">
        "The algorithm rewards consistency, but the audience rewards taste."
      </div>
    </>
  );
}
