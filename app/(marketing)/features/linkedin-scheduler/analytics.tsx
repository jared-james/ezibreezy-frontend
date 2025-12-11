// app/(marketing)/features/linkedin-scheduler/analytics.tsx

import { Users, Monitor, Globe, BarChart3, TrendingUp } from "lucide-react";

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
            Understand your
            <br />
            <span className="italic text-brand-primary">impact.</span>
          </h2>
          <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
            Data helps you serve your audience better. It tells you what
            resonates, who is listening, and where your message is traveling.
          </p>
          <p className="font-serif text-sm leading-relaxed text-foreground/70">
            Our intelligence report gives you a clear view of your professional
            footprint, so you can focus on creating content that truly connects.
          </p>
        </div>

        {/* The Grid of Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
          {/* Metric 1 */}
          <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Users className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Followers</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Growth Tracking
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Track new connections. See how many followers you have gained over
              time.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <div className="mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-primary" />
              <div className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <h4 className="font-bold font-serif text-lg mb-1">Demographics</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Visitor Profile
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See the job titles, industries, and regions of the people visiting
              your page.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Monitor className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Page Views</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Traffic Sources
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See total views broken down by mobile and desktop devices.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Globe className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Visitors</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Page Traffic
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See exactly how many people are visiting your profile or company
              page.
            </p>
          </div>

          {/* Metric 5 */}
          <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <BarChart3 className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Shares</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Network Effect
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Track how often your insights are being shared by others in the
              network.
            </p>
          </div>

          {/* Metric 6 */}
          <div className="p-6 hover:bg-white transition-colors group">
            <TrendingUp className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Post Insights</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Engagement
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Break down specific posts by impressions, clicks, comments, and
              reactions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
