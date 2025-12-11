// app/(marketing)/editorial/_posts/social-image-resizer/post.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  slug: "social-image-resizer",
  title: "Social Image Resizer: One Image, Every Platform",
  excerpt:
    "Every platform has its own rules. Its own dimensions. Its own way of cropping what you carefully composed. A look at how one tool eliminates the friction of reformatting the same image five different ways.",
  publishedAt: "2025-12-04",
};

export default function Post() {
  return (
    <>
      {/* Intro Section */}
      <p className="lead text-xl md:text-2xl font-serif leading-relaxed mb-8">
        <span className="float-left text-6xl font-black mr-3 -mt-2.5 font-serif text-brand-primary/80">
          Y
        </span>
        ou have the perfect image. The composition is balanced. The colors are
        right. The message is clear. Then you remember: this needs to go on
        Instagram. And LinkedIn. And Twitter. And each one will crop it
        differently, cutting off the part that matters most.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        So you open your image editor. You create a new file. You adjust the
        dimensions. You export. You repeat this four more times, each for a
        different platform, each with slightly different dimensions, each
        requiring you to re-center and reframe.
      </p>

      <p className="mb-8 text-lg leading-relaxed text-foreground/80">
        It is tedious. It is repetitive. And worst of all, it pulls you out of
        the creative process and into the mechanical work of reformatting. The
        image has not changed. But the platforms demand compliance.
      </p>

      {/* THE TOOL - Minimal, High Contrast, unmistakable CTA */}
      <div className="my-10 p-1 bg-foreground/5 rounded-sm">
        <div className="bg-background border border-foreground/10 p-8 md:p-10 text-center">
          <h3 className="font-serif text-3xl font-medium mb-3">
            Social Image Resizer
          </h3>
          <p className="text-foreground/60 mb-8 max-w-md mx-auto">
            Upload once. Adjust the crop for Instagram, LinkedIn, Twitter, and
            more. Export all sizes at once. No repetition, just results.
          </p>

          <Link
            href="/tools/social-image-resizer"
            className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-foreground text-background px-10 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-brand-primary hover:text-background transition-all duration-300"
          >
            Launch Resizer <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-foreground/40">
            Free • No Account Required
          </p>
        </div>
      </div>

      <div className="my-12 p-8 border-l-2 border-brand-primary/60 bg-surface-hover/30 italic font-serif text-xl leading-loose">
        &ldquo;The friction is not in creating the content. It is in adapting
        it to a dozen different formats. Every extra step is a tax on
        momentum.&rdquo;
      </div>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        The Problem With Platform Dimensions
      </h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Every social platform has its own idea of what an image should be.
        Instagram wants a square, or a 4:5 portrait, or a 16:9 landscape, or a
        9:16 story. LinkedIn prefers a wide banner for articles but a square for
        posts. Twitter crops aggressively in the feed but displays the full
        image when clicked.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        None of these decisions are arbitrary. Each platform optimized for
        mobile viewing, engagement patterns, and feed design. But for the person
        creating content, this creates a problem: you cannot just upload one
        image everywhere. You have to adapt.
      </p>

      <p className="mb-10 text-lg leading-relaxed text-foreground/80">
        And adapting takes time. Not just the time to resize, but the mental
        overhead of remembering dimensions, re-cropping without cutting off key
        elements, and exporting each variation individually. What should take
        seconds stretches into minutes. What should be seamless becomes a
        bottleneck.
      </p>

      <ul className="list-none mb-10 text-lg leading-relaxed text-foreground/80 space-y-6">
        <li className="pl-6 border-l border-foreground/20">
          <strong>You lose the focal point.</strong> What looked perfect at 16:9
          gets the sides chopped off at 1:1. Suddenly the subject is off-center,
          or worse, cut out entirely.
        </li>
        <li className="pl-6 border-l border-foreground/20">
          <strong>You waste creative energy on logistics.</strong> Instead of
          thinking about the message, you are thinking about pixel dimensions
          and aspect ratios.
        </li>
        <li className="pl-6 border-l border-foreground/20">
          <strong>You delay publishing.</strong> The content is ready. But the
          formats are not. So you wait. And momentum stalls.
        </li>
      </ul>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        How Social Image Resizer Solves This
      </h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        The tool eliminates the repetition. Upload your image once. Select the
        platform format you need. Adjust the crop, zoom, and rotation until it
        looks right. Then move to the next format and do the same.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        When you are satisfied with all your crops, export everything at once.
        One click. Multiple files. Each formatted perfectly for its destination.
        No switching between apps. No manual resizing. No risk of forgetting a
        format and having to start over.
      </p>

      <p className="mb-8 text-lg leading-relaxed text-foreground/80">
        The interface shows you exactly what each platform will display. No
        guessing. No surprises. What you see in the preview is what your
        audience will see in their feed.
      </p>

      <div className="space-y-6 mb-8">
        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Multi-Platform Campaigns
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            Launching the same announcement across all channels.
          </p>
          <p className="text-base opacity-90">
            When you need consistent visuals on Instagram, LinkedIn, Twitter,
            and Facebook, this tool ensures your message stays intact across
            every format without redoing the work.
          </p>
        </div>

        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Portfolio Presentations
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            Showcasing work samples on different platforms.
          </p>
          <p className="text-base opacity-90">
            Designers, photographers, and creators need their work to look
            intentional on every platform. One crop for Instagram, another for
            Behance, another for LinkedIn. All from the same source image.
          </p>
        </div>

        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Event Promotions
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            Marketing an event with graphics optimized for each channel.
          </p>
          <p className="text-base opacity-90">
            A single event poster needs to appear correctly as an Instagram
            post, a Facebook event cover, a LinkedIn article banner, and a
            Twitter card. This tool handles all formats from one upload.
          </p>
        </div>

        <div className="p-6 bg-background rounded border border-foreground/5 hover:border-foreground/20 transition-colors">
          <h3 className="font-serif text-lg font-medium mb-2">
            Content Repurposing
          </h3>
          <p className="text-sm text-foreground/60 mb-3 font-serif italic">
            Turning blog graphics into social assets.
          </p>
          <p className="text-base opacity-90">
            You created a featured image for your blog. Now you want to share it
            on social. Instead of manually resizing for each platform, adjust
            once and export everything.
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        What Makes This Different
      </h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        Other tools resize images. But they make you do it one at a time. You
        select a dimension, crop, export. Then you start over for the next
        platform. This tool treats the problem differently: it assumes you need
        multiple formats, not just one.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        It gives you a live preview for every format. You can switch between
        Instagram, LinkedIn, Twitter, and others instantly, adjusting the crop
        for each without re-uploading or restarting. Your settings are
        preserved. Your edits are non-destructive. And when you are ready,
        everything exports at once.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        The tool also remembers that images are not always perfect on the first
        try. You can zoom, rotate, and reposition within each format. If the
        subject is off-center, you adjust it. If the crop is too tight, you zoom
        out. The controls are immediate, and the feedback is instant.
      </p>

      <h2 className="text-3xl font-serif font-bold mt-12 mb-6">
        Removing Friction From the Workflow
      </h2>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        The best tools do not just save time. They remove the mental tax of
        repetitive work. When you no longer have to think about dimensions, when
        you no longer have to remember which platform needs what size, you free
        up space to focus on the content itself.
      </p>

      <p className="mb-6 text-lg leading-relaxed text-foreground/80">
        This is not about automation for automation&rsquo;s sake. It is about
        reducing the gap between creation and distribution. The faster you can
        go from idea to published, the more likely you are to actually publish.
        And the less friction there is in adapting content for different
        platforms, the more likely you are to reach your audience where they
        already are.
      </p>

      <p className="mb-12 text-lg leading-relaxed text-foreground/80">
        One image. Every platform. No extra steps. That is the goal. And when
        the tool works the way it should, you stop thinking about the resizing
        and start thinking about what comes next.
      </p>

      {/* Related Tools */}
      <div className="mt-16 pt-8 border-t border-foreground/10">
        <h3 className="font-serif text-2xl font-medium mb-6">
          Other ways to streamline your content
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/tools/screenshot-studio"
            className="p-6 bg-surface-hover/20 rounded hover:bg-surface-hover/40 transition-all group"
          >
            <h4 className="font-serif text-lg font-medium mb-2 group-hover:text-brand-primary transition-colors">
              Screenshot Studio
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Once your image is cropped, wrap it in a frame and background that
              makes it stand out.
            </p>
          </Link>
          <Link
            href="/tools/instagram-carousel-splitter"
            className="p-6 bg-surface-hover/20 rounded hover:bg-surface-hover/40 transition-all group"
          >
            <h4 className="font-serif text-lg font-medium mb-2 group-hover:text-brand-primary transition-colors">
              Carousel Splitter
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Turn wide images into seamless Instagram carousels without
              manually slicing them.
            </p>
          </Link>
          <Link
            href="/tools/instagram-grid-planner"
            className="p-6 bg-surface-hover/20 rounded hover:bg-surface-hover/40 transition-all group"
          >
            <h4 className="font-serif text-lg font-medium mb-2 group-hover:text-brand-primary transition-colors">
              Grid Planner
            </h4>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Preview how your resized images will look in your Instagram grid
              before posting.
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
              Split one image into a multi-post grid that tells a unified visual
              story.
            </p>
          </Link>
        </div>
      </div>

      {/* Footer / CTA specific to this article */}
      <div className="mt-16 p-10 bg-surface-hover/30 border border-foreground/5 rounded-sm text-center">
        <h3 className="font-serif text-2xl font-medium mb-4">
          Less friction. More focus.
        </h3>
        <p className="mb-8 text-foreground/70 max-w-md mx-auto leading-relaxed">
          EziBreezy removes the tedious steps between creation and distribution.
          Spend your time on the work that matters, not the formatting that
          does not.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block border border-foreground/30 bg-background text-foreground px-8 py-3 font-serif italic text-lg hover:border-brand-primary hover:text-brand-primary transition-all duration-300"
        >
          Start Resizing &rarr;
        </Link>
      </div>
    </>
  );
}
