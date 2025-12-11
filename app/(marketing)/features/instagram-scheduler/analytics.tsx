// app/(marketing)/features/instagram-scheduler/analytics.tsx

import {
  Users,
  Clock,
  MousePointer2,
  BarChart3,
  TrendingUp,
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
            Data is simply
            <br />
            <span className="italic text-brand-primary">empathy.</span>
          </h2>
          <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
            Metrics are not just math. They are signals. They tell us who is
            listening, when they are awake, and what makes them lean in.
          </p>
          <p className="font-serif text-sm leading-relaxed text-foreground/70">
            To understand your analytics is to understand your people. It is the
            practice of listening to the unsaid feedback of your community.
          </p>
        </div>

        {/* The Grid of Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
          {/* Metric 1 */}
          <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Users className="w-5 h-5 text-brand-primary mb-3" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Total Followers
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Growth
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See who is joining the circle and who is drifting away. Understand
              the net growth of your community.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <div className="mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-primary" />
              <div className="w-2 h-2 rounded-full bg-orange-400" />
            </div>
            <h4 className="font-bold font-serif text-lg mb-1">Demographics</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Insights
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See the gender, age, and location of your audience. Know exactly
              who you are speaking to.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Clock className="w-5 h-5 text-brand-primary mb-3" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Best Time to Post
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Optimization
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Discover when your people are listening. Optimize your schedule
              for reach, likes, or comments.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <MousePointer2 className="w-5 h-5 text-brand-primary mb-3" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Profile Clicks
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Conversion
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Track who moves from interest to action. See clicks on website,
              email, and text buttons.
            </p>
          </div>

          {/* Metric 5 */}
          <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <BarChart3 className="w-5 h-5 text-brand-primary mb-3" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Competitor Tracking
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Benchmarks
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Monitor up to 10 peers. Learn from their wins and understand
              industry benchmarks.
            </p>
          </div>

          {/* Metric 6 */}
          <div className="p-6 hover:bg-white transition-colors group">
            <TrendingUp className="w-5 h-5 text-brand-primary mb-3" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Reach & Impressions
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Visibility
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Measure how far your story travels. Deep dives into hashtags and
              Story performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
