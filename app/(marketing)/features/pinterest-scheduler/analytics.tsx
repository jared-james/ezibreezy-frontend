// app/(marketing)/features/pinterest-scheduler/analytics.tsx

import {
  MousePointer2,
  Bookmark,
  Eye,
  Users,
  Layout,
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
            Map the
            <br />
            <span className="italic text-brand-primary">intent.</span>
          </h2>
          <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
            A Pin isn&apos;t just an image; it&apos;s a bookmark for a future action.
            Analytics on Pinterest reveal what your audience is planning to
            do.
          </p>
          <p className="font-serif text-sm leading-relaxed text-foreground/70">
            Understand which ideas are resonating and which visuals are
            driving people off the platform and onto your site.
          </p>
        </div>

        {/* The Grid of Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
          {/* Metric 1 */}
          <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <MousePointer2 className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Outbound Clicks
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Traffic
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              The most valuable metric. See how many people are leaving
              Pinterest to visit your website.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <div className="mb-3 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-foreground/40 group-hover:text-brand-primary transition-colors" />
            </div>
            <h4 className="font-bold font-serif text-lg mb-1">Saves</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Intent
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              The digital equivalent of tearing a page from a magazine. See
              what people are keeping.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Eye className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Impressions
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Discovery
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See how often your Pins are appearing in search results and
              home feeds.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Users className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Total Audience
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Reach
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              The total number of unique people who have seen or engaged
              with your Pins.
            </p>
          </div>

          {/* Metric 5 */}
          <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Layout className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Top Boards
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Curation
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Identify which of your collections are performing best and
              attracting the most attention.
            </p>
          </div>

          {/* Metric 6 */}
          <div className="p-6 hover:bg-white transition-colors group">
            <Sparkles className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Engaged Audience
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Action
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              The number of people who interacted with your Pins (clicks,
              saves, reactions).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
