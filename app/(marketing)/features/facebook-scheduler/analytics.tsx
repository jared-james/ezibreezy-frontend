// app/(marketing)/features/facebook-scheduler/analytics.tsx

import {
  Users,
  Star,
  Eye,
  Tv,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function Analytics() {
  return (
    <section className="mb-24">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="font-mono text-xs uppercase tracking-widest font-bold bg-foreground text-background px-2 py-1">
          Market Intelligence
        </h3>
        <div className="h-px flex-1 bg-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 border border-foreground">
        {/* Lead: The Philosophy of Data */}
        <div className="p-8 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-foreground bg-background-editorial">
          <h2 className="font-serif text-3xl font-bold leading-none mb-6">
            Know your
            <br />
            <span className="italic text-brand-primary">residents.</span>
          </h2>
          <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
            A community isn&apos;t just a number. It&apos;s people. It&apos;s fans who
            return, and new faces discovering you for the first time.
          </p>
          <p className="font-serif text-sm leading-relaxed text-foreground/70">
            Our intelligence report breaks down the health of your Page,
            showing you not just who sees your content, but who is sticking
            around.
          </p>
        </div>

        {/* The Grid of Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
          {/* Metric 1 */}
          <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Users className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Total Followers
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Growth
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See the steady rise of your community over time. Measure the
              long-term health of your brand.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <div className="mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-foreground/40 group-hover:text-brand-primary transition-colors" />
            </div>
            <h4 className="font-bold font-serif text-lg mb-1">Fan Base</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Loyalty
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Track gained and lost fans. Understand what content builds
              loyalty and what drives people away.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Eye className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Page Views
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Visibility
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See how many eyes are on your storefront. Track impressions
              and views across the platform.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Tv className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Video Views
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Retention
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              From Reels to live streams, see how many people are tuning in
              and watching your stories unfold.
            </p>
          </div>

          {/* Metric 5 */}
          <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <BarChart3 className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Post Impressions
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Reach
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              How far did your message travel? Measure the total footprint
              of your posts in the feed.
            </p>
          </div>

          {/* Metric 6 */}
          <div className="p-6 hover:bg-white transition-colors group">
            <Sparkles className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Post Tracking
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Engagement
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Drill down into specific posts. See engaged users, clicks, and
              reactions for every update.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
