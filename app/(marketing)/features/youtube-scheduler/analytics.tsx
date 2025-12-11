// app/(marketing)/features/youtube-scheduler/analytics.tsx

import {
  Users,
  Play,
  Eye,
  Smartphone,
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
            Listen to the
            <br />
            <span className="italic text-brand-primary">signal.</span>
          </h2>
          <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
            Views are validation, but retention is truth. Analytics tell you not
            just how many people clicked, but how many people cared.
          </p>
          <p className="font-serif text-sm leading-relaxed text-foreground/70">
            Our intelligence report helps you understand your audience's
            behavior, so you can create more of what they love.
          </p>
        </div>

        {/* The Grid of Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
          {/* Metric 1 */}
          <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Users className="w-5 h-5 text-brand-primary mb-3" />
            <h4 className="font-bold font-serif text-lg mb-1">Subscribers</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Loyalty
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Track the growth of your dedicated audience. See who is signing up
              for the long haul.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <div className="mb-3 flex items-center gap-2">
              <Play className="w-5 h-5 text-brand-primary" />
            </div>
            <h4 className="font-bold font-serif text-lg mb-1">Video Views</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Reach
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See the total footprint of your library. Track which videos
              continue to perform over time.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Eye className="w-5 h-5 text-brand-primary mb-3" />
            <h4 className="font-bold font-serif text-lg mb-1">Impressions</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Discovery
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Understand how often your thumbnails are appearing in search and
              recommendations.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Smartphone className="w-5 h-5 text-brand-primary mb-3" />
            <h4 className="font-bold font-serif text-lg mb-1">Shorts Views</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Momentum
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Track the performance of your short-form content in the Shorts
              Feed.
            </p>
          </div>

          {/* Metric 5 */}
          <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <BarChart3 className="w-5 h-5 text-brand-primary mb-3" />
            <h4 className="font-bold font-serif text-lg mb-1">Watch Time</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Attention
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              The metric that matters most. See how many hours your audience has
              spent with you.
            </p>
          </div>

          {/* Metric 6 */}
          <div className="p-6 hover:bg-white transition-colors group">
            <Sparkles className="w-5 h-5 text-brand-primary mb-3" />
            <h4 className="font-bold font-serif text-lg mb-1">Engagement</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Interaction
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Track likes, comments, and shares to see which videos spark a
              reaction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
