// app/(marketing)/features/twitter-scheduler/analytics.tsx

import {
  Eye,
  MousePointer2,
  Heart,
  Repeat,
  MessageSquare,
  BarChart3,
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
            Measure the
            <br />
            <span className="italic text-brand-primary">resonance.</span>
          </h2>
          <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
            Twitter moves fast. Analytics allow you to see the ripples your
            words create in real-time.
          </p>
          <p className="font-serif text-sm leading-relaxed text-foreground/70">
            Understand which topics spark conversation and which formats
            drive action. Turn the noise into a clear signal for your next
            move.
          </p>
        </div>

        {/* The Grid of Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
          {/* Metric 1 */}
          <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Eye className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Impressions
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Visibility
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See how many timelines your thoughts have graced. The total
              reach of your voice.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <div className="mb-3 flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-foreground/40 group-hover:text-brand-primary transition-colors" />
            </div>
            <h4 className="font-bold font-serif text-lg mb-1">
              Profile Visits
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Curiosity
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Track how many people stopped scrolling to learn more about
              who you are.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Heart className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Likes</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Appreciation
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              A simple signal of agreement. See which sentiments resonate
              most.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Repeat className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Retweets</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Amplification
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              The highest compliment. Track who is spreading your message to
              their own network.
            </p>
          </div>

          {/* Metric 5 */}
          <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <MessageSquare className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Replies</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Conversation
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Track the discussions you ignite. Identify the topics that
              people want to talk about.
            </p>
          </div>

          {/* Metric 6 */}
          <div className="p-6 hover:bg-white transition-colors group">
            <BarChart3 className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Link Clicks
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Conversion
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See how effectively your content drives traffic to your work,
              newsletter, or portfolio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
