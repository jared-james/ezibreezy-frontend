// app/(marketing)/editorial/_posts/youtube-title-checker/post.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  slug: "youtube-title-checker",
  title: "YouTube Title Checker: The Words That Get Cut Off Matter Most",
  excerpt:
    "The most important part of your title is often the part that disappears. A look at how truncation shapes what people click, and how to write for the cut.",
  publishedAt: "2025-12-03",
};

export default function Post() {
  return (
    <>
      {/* Intro Section */}
      <p className="lead text-xl md:text-2xl font-serif leading-relaxed mb-8">
        <span className="float-left text-6xl font-black mr-3 -mt-2.5 font-serif text-brand-primary/80">
          Y
        </span>
        ou spent an hour crafting the perfect YouTube title. The hook is
        sharp. The curiosity gap is tight. The keywords are placed
        strategically. You hit publish, check your phone, and realize: half
        of it is gone. Replaced with an ellipsis. The best part, the part
        that made someone want to click, is invisible.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        YouTube does not show your full title everywhere. On mobile, titles
        truncate after 40 to 50 characters depending on font width. On
        desktop, you get more room, but not infinite room. In suggested
        videos, the cutoff comes even sooner. The platform decides what gets
        seen. And if your hook is buried past the ellipsis, it does not exist.
      </p>

      <p className="mb-8 text-lg leading-relaxed text-foreground/80">
        This is not a flaw. It is a constraint. And constraints force clarity.
        If you cannot fit the hook in the visible portion, the title is not
        working. The question is not whether truncation happens. The question
        is whether you are writing for it.
      </p>

      {/* THE TOOL - Minimal, High Contrast, unmistakable CTA */}
      <div className="my-10 p-1 bg-foreground/5 rounded-sm">
        <div className="bg-background border border-foreground/10 p-8 md:p-10 text-center">
          <h3 className="font-serif text-3xl font-medium mb-3">
            YouTube Title Checker
          </h3>
          <p className="text-foreground/60 mb-8 max-w-md mx-auto">
            Preview your title exactly as it appears on mobile, desktop, and
            suggested feeds. See what gets cut. Fix it before you publish.
          </p>

          <Link
            href="/tools/youtube-title-checker"
            className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-foreground text-background px-10 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-primary hover:text-background transition-all duration-300"
          >
            Launch Checker <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-foreground/40">
            Free • No Account Required
          </p>
        </div>
      </div>

      <div className="my-12 p-8 border-l-2 border-brand-primary/60 bg-surface-hover/30 italic font-serif text-xl leading-loose">
        &ldquo;A title is only as good as its first 40 characters. Everything
        else is a gamble on whether someone will see it.&rdquo;
      </div>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        Why Truncation Ruins Good Titles
      </h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Most creators write titles from left to right, front-loading the setup
        and saving the payoff for the end. This works in a headline that gets
        read in full. But YouTube titles do not get read in full. They get
        scanned. And scanning means the first few words carry all the weight.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        When the hook comes late, it disappears. The viewer sees the generic
        part, the context, the setup. They do not see the reason to click. And
        without that reason visible in the truncated preview, your
        click-through rate suffers. Not because the title is bad. Because it is
        not optimized for how people actually see it.
      </p>

      <p className="mb-10 text-lg leading-relaxed text-foreground/80">
        Truncation is not random. It follows predictable patterns. Mobile
        truncates earlier than desktop. Suggested videos truncate earlier than
        search results. Certain characters, like capital letters and wide
        punctuation, take up more space and trigger earlier cutoffs. If you are
        not testing for these variables, you are publishing blind.
      </p>

      <ul className="list-none mb-10 text-lg leading-relaxed text-foreground/80 space-y-6">
        <li className="pl-6 border-l border-foreground/20">
          <strong>The hook gets buried.</strong> If your most compelling phrase
          is in the second half of the title, mobile users will never see it.
          They decide whether to click based on the truncated version, not the
          full one.
        </li>
        <li className="pl-6 border-l border-foreground/20">
          <strong>The keyword loses impact.</strong> SEO advice says to include
          keywords early. But if the keyword is generic and the specificity
          comes later, the truncated title reads like every other video in the
          feed.
        </li>
        <li className="pl-6 border-l border-foreground/20">
          <strong>The curiosity gap closes.</strong> A great title withholds
          just enough information to make someone curious. But if the withholding
          happens past the ellipsis, there is no gap. Just confusion.
        </li>
      </ul>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        How to Write for the Cut
      </h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Writing for truncation is not about making shorter titles. It is about
        front-loading value. The first 40 characters need to stand alone. They
        need to give someone a reason to click even if the rest of the title
        never gets seen.
      </p>

      <p className="mb-8 text-lg leading-relaxed text-foreground/80">
        This means rethinking structure. Instead of building suspense, you
        deliver the hook immediately. Instead of providing context first, you
        lead with the payoff. The second half of the title can add specificity,
        but it should not be necessary for the title to work.
      </p>

      <div className="space-y-6 mb-8">
        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Lead With the Surprising Part
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            The thing that makes someone pause should be visible first.
          </p>
          <p className="text-base opacity-90 mb-3">
            Weak: &ldquo;How I Grew My Channel in 30 Days Using This One
            Trick&rdquo;
          </p>
          <p className="text-base opacity-90 mb-3">
            Truncated (mobile): &ldquo;How I Grew My Channel in 30 Days
            Using...&rdquo;
          </p>
          <p className="text-base opacity-90 mb-3">
            Strong: &ldquo;This One Trick Grew My Channel 10x in 30
            Days&rdquo;
          </p>
          <p className="text-base opacity-90">
            Truncated (mobile): &ldquo;This One Trick Grew My Channel 10x
            in...&rdquo;
          </p>
        </div>

        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Make Every Word Earn Its Space
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            Filler words and generic phrasing waste visible characters.
          </p>
          <p className="text-base opacity-90 mb-3">
            Weak: &ldquo;The Ultimate Guide to Learning How to Edit Videos
            Faster&rdquo;
          </p>
          <p className="text-base opacity-90 mb-3">
            Truncated (mobile): &ldquo;The Ultimate Guide to Learning How
            to...&rdquo;
          </p>
          <p className="text-base opacity-90 mb-3">
            Strong: &ldquo;Edit Videos 3x Faster With These 5 Shortcuts&rdquo;
          </p>
          <p className="text-base opacity-90">
            Truncated (mobile): &ldquo;Edit Videos 3x Faster With These
            5...&rdquo;
          </p>
        </div>

        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Test Before You Publish
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            What looks good in the upload screen may break in the feed.
          </p>
          <p className="text-base opacity-90">
            Use the title checker to see exactly where the cut happens on
            mobile, desktop, and suggested videos. If the truncated version does
            not make sense or loses the hook, rewrite until it does.
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        What the Tool Shows You
      </h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        The YouTube Title Checker gives you a live preview of how your title
        appears across different contexts. You type your title, and the tool
        renders it exactly as YouTube would display it on mobile, on desktop,
        and in suggested video feeds.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        You see the character count. You see where the ellipsis appears. You
        see whether the hook survives truncation or gets cut. And if it gets
        cut, you can revise in real time until the visible portion works on its
        own.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        The tool also lets you upload a thumbnail preview, so you can see how
        the title and image work together. A strong thumbnail can compensate for
        a weaker title, but only if the two are tested together. Seeing them
        side by side, as they would appear in the feed, removes the guesswork.
      </p>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        The Constraint That Improves Writing
      </h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Truncation is frustrating. But it is also clarifying. When you know that
        only the first 40 characters matter, you stop wasting them. You cut the
        filler. You front-load the value. You make every word justify its
        presence.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        This does not just help with click-through rates. It makes your titles
        sharper. More direct. Easier to scan. Even when someone does see the
        full title, the discipline of writing for truncation ensures that the
        most important information comes first.
      </p>

      <p className="mb-12 text-lg leading-relaxed text-foreground/80">
        The best titles do not need the second half to work. They are
        front-loaded by design. And when you write with that constraint in mind,
        truncation stops being a problem. It becomes a standard you meet before
        you publish.
      </p>

      {/* Related Tools */}
      <div className="mt-16 pt-8 border-t border-foreground/10">
        <h3 className="font-serif text-2xl font-medium mb-6">
          Other ways to refine your content
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/tools/linkedin-text-formatter"
            className="p-6 bg-surface-hover/20 rounded hover:bg-surface-hover/40 transition-all group"
          >
            <h4 className="font-serif text-lg font-medium mb-2 group-hover:text-brand-primary transition-colors">
              LinkedIn Text Formatter
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Apply the same clarity and structure to your LinkedIn posts that
              you bring to your YouTube titles.
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
              Make your video descriptions and social promotions stand out with
              intentional typography.
            </p>
          </Link>
          <Link
            href="/tools/screenshot-studio"
            className="p-6 bg-surface-hover/20 rounded hover:bg-surface-hover/40 transition-all group"
          >
            <h4 className="font-serif text-lg font-medium mb-2 group-hover:text-brand-primary transition-colors">
              Screenshot Studio
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Create polished thumbnails and social graphics that complement your
              optimized titles.
            </p>
          </Link>
          <Link
            href="/tools/social-image-resizer"
            className="p-6 bg-surface-hover/20 rounded hover:bg-surface-hover/40 transition-all group"
          >
            <h4 className="font-serif text-lg font-medium mb-2 group-hover:text-brand-primary transition-colors">
              Social Image Resizer
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Promote your videos across platforms with thumbnails cropped for
              every feed.
            </p>
          </Link>
        </div>
      </div>

      {/* Footer / CTA specific to this article */}
      <div className="mt-16 p-10 bg-surface-hover/30 border border-foreground/5 rounded-sm text-center">
        <h3 className="font-serif text-2xl font-medium mb-4">
          Write for what people see, not what you publish.
        </h3>
        <p className="mb-8 text-foreground/70 max-w-md mx-auto leading-relaxed">
          EziBreezy helps you test, refine, and optimize your content before it
          reaches your audience. No guesswork, just clarity.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block border border-foreground/30 bg-background text-foreground px-8 py-3 font-serif italic text-lg hover:border-brand-primary hover:text-brand-primary transition-all duration-300"
        >
          Start Optimizing &rarr;
        </Link>
      </div>
    </>
  );
}
