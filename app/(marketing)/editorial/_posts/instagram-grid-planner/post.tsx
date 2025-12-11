// app/(marketing)/editorial/_posts/instagram-grid-planner/post.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  slug: "instagram-grid-planner",
  title: "Instagram Grid Planner: Plan Your Feed Layout Online",
  excerpt:
    "Your feed is not a collection of individual posts. It is a gallery. A look at how we help you see the whole before you share the parts.",
  publishedAt: "2025-12-09",
};

export default function Post() {
  return (
    <>
      {/* Intro Section */}
      <p className="lead text-xl md:text-2xl font-serif leading-relaxed mb-8">
        <span className="float-left text-6xl font-black mr-3 -mt-2.5 font-serif text-brand-primary/80">
          Y
        </span>
        ou have done the work. The photo is perfect. The caption is ready. Your
        finger hovers over the post button. But there is a question you cannot
        see the answer to: how will this look next to everything else?
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Instagram was never meant to be about individual moments in isolation.
        It was designed as a grid. A canvas. A way of showing not just what you
        see, but how you see.
      </p>

      <p className="mb-8 text-lg leading-relaxed text-foreground/80">
        And yet, most of us post one image at a time, hoping it fits. Hoping the
        colors work. Hoping the rhythm feels right. We cannot see the whole, so
        we guess.
      </p>

      {/* THE TOOL - Minimal, High Contrast, unmistakable CTA */}
      <div className="my-10 p-1 bg-foreground/5 rounded-sm">
        <div className="bg-background border border-foreground/10 p-8 md:p-10 text-center">
          <h3 className="font-serif text-3xl font-medium mb-3">
            Instagram Grid Planner
          </h3>
          <p className="text-foreground/60 mb-8 max-w-md mx-auto">
            Upload your photos. Arrange them. See your feed the way your
            audience will before you share it with the world.
          </p>

          <Link
            href="/tools/instagram-grid-planner"
            className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-foreground text-background px-10 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-primary hover:text-background transition-all duration-300"
          >
            Launch Planner <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-foreground/40">
            Free • No Account Required
          </p>
        </div>
      </div>

      <div className="my-12 p-8 border-l-2 border-brand-primary/60 bg-surface-hover/30 italic font-serif text-xl leading-loose">
        &ldquo;A grid is not nine separate squares. It is a single story told in
        chapters. When you plan it as a whole, your audience feels the
        difference.&rdquo;
      </div>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        Why the Grid Matters
      </h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        When someone visits your profile, they are not looking at your latest
        post. They are looking at your entire presence. The grid is the first
        impression, the visual handshake, the moment they decide whether to
        follow or keep scrolling.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        A thoughtful grid does not happen by accident. It happens when you step
        back far enough to see the patterns. When you notice that three dark
        images in a row create heaviness. When you realize that alternating
        between close-ups and wide shots creates rhythm.
      </p>

      <p className="mb-10 text-lg leading-relaxed text-foreground/80">
        Planning your grid is an act of respect. For your work, yes. But more
        importantly, for the people who will see it.
      </p>

      <ul className="list-none mb-10 text-lg leading-relaxed text-foreground/80 space-y-6">
        <li className="pl-6 border-l border-foreground/20">
          <strong>You are creating coherence.</strong> When your feed has a
          visual rhythm, it feels intentional. It signals that you care about
          the experience, not just the content.
        </li>
        <li className="pl-6 border-l border-foreground/20">
          <strong>You are building trust.</strong> Consistency is a form of
          reliability. When your aesthetic is clear and deliberate, people know
          what to expect. And expectation is the foundation of loyalty.
        </li>
        <li className="pl-6 border-l border-foreground/20">
          <strong>You are telling a story.</strong> A grid is a narrative
          structure. The order matters. The pacing matters. What comes before
          influences what comes after.
        </li>
      </ul>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        When to Use a Grid Planner
      </h2>

      <p className="mb-8 text-lg leading-relaxed text-foreground/80">
        Not every account needs a meticulously planned grid. But if you are
        building a brand, showcasing a portfolio, or trying to create a visual
        identity that people remember, planning ahead changes everything.
      </p>

      <div className="space-y-6 mb-8">
        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Before a Product Launch
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            When the first nine posts need to work as one introduction.
          </p>
          <p className="text-base opacity-90">
            A launch is not a single announcement. It is a series of moments
            that build anticipation. When you can see them all at once, you can
            ensure the story unfolds with intention.
          </p>
        </div>

        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Photographers and Visual Artists
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            When your portfolio is your presence.
          </p>
          <p className="text-base opacity-90">
            Your grid is your gallery wall. The order, the color harmony, the
            balance between light and dark—these are not minor details. They are
            the curatorial choices that define your voice.
          </p>
        </div>

        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Seasonal Campaigns
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            When you need a cohesive look for a specific period.
          </p>
          <p className="text-base opacity-90">
            Planning a week of holiday content? A month of summer vibes? Seeing
            the full arc before you post the first piece helps you maintain the
            mood from start to finish.
          </p>
        </div>

        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Rebranding or Refreshing Your Aesthetic
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            When you are shifting direction and need to see the transition.
          </p>
          <p className="text-base opacity-90">
            Change does not have to be jarring. When you plan the shift, you can
            ease your audience from the old identity to the new without losing
            them along the way.
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">How It Works</h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        The planner gives you what Instagram itself does not: perspective. You
        upload your images, drag them into order, and see your feed as a grid.
        You can rearrange until the rhythm feels right. Until the colors
        balance. Until the story makes sense.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        It is not about perfection. It is about clarity. When you can see the
        whole, you make better decisions about the parts.
      </p>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        The Difference Between Posting and Planning
      </h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Posting is reactive. You create something, you share it, you move on.
        There is a place for that kind of spontaneity. But planning is
        intentional. It is the difference between throwing paint at a canvas and
        composing a painting.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        When you plan your grid, you are not being rigid. You are being
        thoughtful. You are considering the experience of the person who will
        visit your profile. You are asking: what do I want them to feel?
      </p>

      <p className="mb-12 text-lg leading-relaxed text-foreground/80">
        That question changes everything. Because once you know the feeling you
        are creating, every choice becomes clearer.
      </p>

      {/* Related Tools */}
      <div className="mt-16 pt-8 border-t border-foreground/10">
        <h3 className="font-serif text-2xl font-medium mb-6">
          Other ways to shape your presence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/tools/instagram-carousel-splitter"
            className="p-6 bg-surface-hover/20 rounded hover:bg-surface-hover/40 transition-all group"
          >
            <h4 className="font-serif text-lg font-medium mb-2 group-hover:text-brand-primary transition-colors">
              Carousel Splitter
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Turn wide moments into swipeable stories that sit beautifully in
              your planned grid.
            </p>
          </Link>
          <Link
            href="/tools/instagram-grid-maker"
            className="p-6 bg-surface-hover/20 rounded hover:bg-surface-hover/40 transition-all group"
          >
            <h4 className="font-serif text-lg font-medium mb-2 group-hover:text-brand-primary transition-colors">
              Grid Maker
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Create a multi-post grid from a single image to anchor your feed
              with a bold visual statement.
            </p>
          </Link>
          <Link
            href="/tools/instagram-font-generator"
            className="p-6 bg-surface-hover/20 rounded hover:bg-surface-hover/40 transition-all group"
          >
            <h4 className="font-serif text-lg font-medium mb-2 group-hover:text-brand-primary transition-colors">
              Font Generator
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Give your bio and captions the same intentionality as your visual
              grid.
            </p>
          </Link>
          <Link
            href="/editorial/instagram-captions-2025"
            className="p-6 bg-surface-hover/20 rounded hover:bg-surface-hover/40 transition-all group"
          >
            <h4 className="font-serif text-lg font-medium mb-2 group-hover:text-brand-primary transition-colors">
              Caption Library
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Once your grid is planned, find the words that complete the story.
            </p>
          </Link>
        </div>
      </div>

      {/* Footer / CTA specific to this article */}
      <div className="mt-16 p-10 bg-surface-hover/30 border border-foreground/5 rounded-sm text-center">
        <h3 className="font-serif text-2xl font-medium mb-4">
          See the whole. Shape the story.
        </h3>
        <p className="mb-8 text-foreground/70 max-w-md mx-auto leading-relaxed">
          EziBreezy helps you step back and see what your audience will see, so
          you can share with confidence instead of guesswork.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block border border-foreground/30 bg-background text-foreground px-8 py-3 font-serif italic text-lg hover:border-brand-primary hover:text-brand-primary transition-all duration-300"
        >
          Start Planning &rarr;
        </Link>
      </div>
    </>
  );
}
