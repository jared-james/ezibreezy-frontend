// app/(marketing)/features/threads-scheduler/analytics.tsx

import {
  Heart,
  MessageCircle,
  Repeat,
  UserPlus,
  Hash,
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
            Read the
            <br />
            <span className="italic text-brand-primary">room.</span>
          </h2>
          <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-6">
            In a conversation, listening is as important as speaking.
            Analytics help you listen at scale.
          </p>
          <p className="font-serif text-sm leading-relaxed text-foreground/70">
            Our intelligence report shows you which topics ignite dialogue,
            helping you steer the conversation where it naturally wants to
            go.
          </p>
        </div>

        {/* The Grid of Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-surface-hover/10">
          {/* Metric 1 */}
          <div className="p-6 border-b sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <UserPlus className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Followers</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Circle Growth
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See how many people have pulled up a chair to listen to what
              you have to say.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-6 border-b md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <div className="mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-foreground/40 group-hover:text-brand-primary transition-colors" />
            </div>
            <h4 className="font-bold font-serif text-lg mb-1">Likes</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Resonance
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Track the moments of agreement. See which sentiments connect
              instantly.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-6 border-b sm:border-r-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <MessageCircle className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Replies</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Dialogue
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              The heart of Threads. Track the depth of the conversations you
              start.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="p-6 border-b md:border-b-0 sm:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Repeat className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">Reposts</h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Amplification
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              See who is taking your message and sharing it with their own
              circle.
            </p>
          </div>

          {/* Metric 5 */}
          <div className="p-6 border-b sm:border-b-0 md:border-r border-foreground/20 hover:bg-white transition-colors group">
            <Hash className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Topic Tags
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Discovery
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              Analyze which tags are helping you reach new audiences outside
              your following.
            </p>
          </div>

          {/* Metric 6 */}
          <div className="p-6 hover:bg-white transition-colors group">
            <Sparkles className="w-5 h-5 text-foreground/40 mb-3 group-hover:text-brand-primary transition-colors" />
            <h4 className="font-bold font-serif text-lg mb-1">
              Engagement
            </h4>
            <p className="text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">
              Activity Rate
            </p>
            <p className="text-sm text-foreground/70 leading-snug">
              The pulse of your profile. Measure the overall liveliness of
              your presence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
