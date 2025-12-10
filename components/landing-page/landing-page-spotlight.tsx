// components/landing-page/landing-page-spotlight.tsx

import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Music2,
  AtSign,
  Users,
  ShieldCheck,
  BarChart3,
  Layers,
  Zap,
  Pin,
  Clock,
  Check,
  Hammer,
  AlignLeft,
  Hash,
  Tag,
  Split,
  Image as ImageIcon,
  MessageCircle,
  Fingerprint,
  FolderOpen,
} from "lucide-react";

export default function LandingPageSpotlight() {
  return (
    <section className="relative bg-background-editorial text-foreground py-24 px-6 border-b border-foreground overflow-hidden">
      <style>{`
        @keyframes flash-red-green {
          0%, 100% { background-color: #ef4444; box-shadow: 0 0 5px rgba(239, 68, 68, 0.5); } 
          50% { background-color: #22c55e; box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
        }
        .animate-connectivity {
          animation: flash-red-green 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-[3px] border-foreground pb-6 mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-primary font-bold mb-4">
              System Capabilities
            </p>
            <h2 className="font-serif text-5xl md:text-7xl font-light tracking-tight leading-[0.9]">
              The <span className="font-bold">Feature</span> Ledger.
            </h2>
          </div>
          <div className="hidden md:block text-right">
            <p className="font-serif italic text-2xl">Vol. 1, Full Suite</p>
          </div>
        </div>

        {/* --- MAIN BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-[minmax(300px,auto)] mb-4">
          {/* 1. ASSET MANAGEMENT (Media) */}
          <div className="md:col-span-6 lg:col-span-7 bg-surface border-2 border-foreground p-8 relative group overflow-hidden">
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-brand-primary rounded-full" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                    Cloud Storage R2
                  </span>
                </div>
                <h3 className="font-serif text-4xl font-medium mb-4">
                  Intelligent Media Room
                </h3>
                <p className="font-serif text-lg text-foreground/70 max-w-md">
                  Not just a bucket. We handle auto-cropping for X, aspect ratio
                  checks for LinkedIn, and format conversion for TikTok on the
                  fly.
                </p>
              </div>

              {/* Visualization of Grid */}
              <div className="mt-8 grid grid-cols-4 gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="col-span-4 flex items-center gap-3 mb-2 border-b border-foreground/10 pb-2">
                  <div className="w-12 h-12 rounded-full border border-foreground/20 bg-foreground/5" />
                  <div className="space-y-1">
                    <div className="w-32 h-3 bg-foreground/10 rounded-sm" />
                    <div className="w-20 h-2 bg-foreground/10 rounded-sm" />
                  </div>
                </div>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square border border-foreground/10 bg-background-editorial relative group/item"
                  >
                    <div className="absolute inset-0 bg-transparent transition-colors group-hover/item:bg-foreground/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. CONNECTIVITY (Integrations) */}
          <div className="md:col-span-6 lg:col-span-5 bg-surface-hover border-2 border-foreground p-8 relative flex flex-row gap-6">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full animate-connectivity" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                  Connectivity
                </span>
              </div>
              <h3 className="font-serif text-3xl font-medium mb-4 leading-tight">
                Universal Signal
              </h3>
              <p className="font-serif text-base text-foreground/70 mb-auto pr-4">
                Native integrations for the big 8. No third-party wrappers.
                Direct API access with auto-token refresh handling.
              </p>

              <div className="mt-8 hidden sm:block">
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">
                  Network Status: Active
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Twitter, label: "X" },
                  { icon: Instagram, label: "IG" },
                  { icon: Linkedin, label: "LI" },
                  { icon: Facebook, label: "FB" },
                  { icon: Youtube, label: "YT" },
                  { icon: Music2, label: "TT" },
                  { icon: AtSign, label: "TH" },
                  { icon: Pin, label: "PIN" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="relative w-14 h-14 rounded-full border-2 border-foreground bg-surface flex items-center justify-center shadow-[3px_3px_0_0_var(--foreground)] cursor-default group"
                    title={p.label}
                  >
                    <p.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. COMMAND & CONTROL */}
          <div className="md:col-span-6 lg:col-span-4 bg-surface border-2 border-foreground p-8 relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-brand-primary rounded-full" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                Workflow Logic
              </span>
            </div>

            <h3 className="font-serif text-2xl font-medium mb-6">
              Command & Control
            </h3>

            <ul className="space-y-4 font-serif text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <Users className="w-4 h-4 mt-1 text-brand-primary" />
                <span>
                  <strong>Data Silos.</strong> Workspaces isolate clients and
                  brands completely.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 mt-1 text-brand-primary" />
                <span>
                  <strong>Consensus Policy.</strong> Require "Any" or "All"
                  admin approvals before publishing.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Layers className="w-4 h-4 mt-1 text-brand-primary" />
                <span>
                  <strong>Audit Trail.</strong> Full history of who approved,
                  rejected, or edited a post.
                </span>
              </li>
            </ul>
          </div>

          {/* 4. ANALYTICS */}
          <div className="md:col-span-6 lg:col-span-4 bg-surface border-2 border-foreground p-8 relative">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                Unified Intelligence
              </span>
            </div>

            <h3 className="font-serif text-2xl font-medium mb-4">
              Aggregated Analytics
            </h3>

            <p className="font-serif text-sm text-foreground/70 mb-6">
              Stop summing up Excel spreadsheets. We aggregate metrics across
              platforms to give you a single "Total Reach" number for your
              brand.
            </p>

            <div className="rounded-sm p-4 flex items-center gap-3 bg-surface-hover border border-foreground/20">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-brand-primary-foreground border border-foreground flex items-center justify-center font-bold text-xs">
                %
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <div className="h-2 w-16 bg-foreground/10 rounded-sm" />
                  <div className="h-2 w-8 bg-green-500/20 rounded-sm" />
                </div>
                <div className="h-1.5 w-full bg-foreground/5 rounded-sm overflow-hidden">
                  <div className="h-full w-3/4 bg-foreground/20" />
                </div>
              </div>
            </div>
          </div>

          {/* 5. AI */}
          <div className="md:col-span-6 lg:col-span-4 bg-brand-primary border-2 border-foreground p-8 relative text-brand-primary-foreground">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand-primary-foreground/70">
                Input Classifiers
              </span>
            </div>

            <h3 className="font-serif text-2xl font-medium mb-4">
              Idea Engine
            </h3>

            <p className="font-serif text-sm text-brand-primary-foreground/90 leading-relaxed">
              Our classifiers identify if you are inputting a work log, an
              observation, or a news reaction, then structure the draft
              accordingly.
              <br />
              <br />
              <span className="opacity-80">
                Context-aware drafting beats generic "Write me a post" prompts.
              </span>
            </p>

            <div className="absolute bottom-4 right-4 opacity-10 rotate-12">
              <span className="font-serif text-9xl font-black">AI</span>
            </div>
          </div>
        </div>

        {/* --- TECHNICAL SPECIFICATIONS LIST (The Granular Features) --- */}
        <div className="w-full bg-surface border-2 border-foreground p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Hammer className="w-5 h-5 text-brand-primary" />
            <h3 className="font-serif text-2xl font-medium">
              Technical Specifications
            </h3>
            <div className="h-px bg-foreground/20 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
            {/* Spec 1: Smart Threading */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <Split className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  Publishing
                </span>
              </div>
              <h4 className="font-bold text-sm">Auto-Splitting Threads</h4>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Writing a long-form post? We automatically detect length limits
                (280 chars for X, 500 for Threads) and split your text into a
                perfectly linked reply chain.
              </p>
            </div>

            {/* Spec 2: First Comment */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <MessageCircle className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  Instagram / FB
                </span>
              </div>
              <h4 className="font-bold text-sm">First Comment Logic</h4>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Keep your captions clean. We allow you to schedule the first
                comment along with the post to hide your hashtags below the fold
                automatically.
              </p>
            </div>

            {/* Spec 3: User Tagging */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <Tag className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  Metadata
                </span>
              </div>
              <h4 className="font-bold text-sm">Native User Tagging</h4>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Don't just mention in captions. We support native photo tagging
                coords (x,y) for Instagram, ensuring collaborators get notified
                properly.
              </p>
            </div>

            {/* Spec 4: Timezones */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  Scheduling
                </span>
              </div>
              <h4 className="font-bold text-sm">Timezone Sovereignty</h4>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Every workspace has its own timezone. "9 AM" means 9 AM for the
                client in Tokyo, not 9 AM on your server in Virginia.
              </p>
            </div>

            {/* Spec 5: Deduplication */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <Fingerprint className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  Storage
                </span>
              </div>
              <h4 className="font-bold text-sm">Asset Deduplication</h4>
              <p className="text-xs text-foreground/70 leading-relaxed">
                We hash every file on upload. If you try to upload the same meme
                twice to a workspace, we catch it and link to the existing asset
                to save your quota.
              </p>
            </div>

            {/* Spec 6: Story Sequencing */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <Layers className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  Stories
                </span>
              </div>
              <h4 className="font-bold text-sm">Story Sequencing</h4>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Upload 5 videos at once for a story. We don't make a carousel;
                we automatically split them into 5 sequential story posts posted
                seconds apart.
              </p>
            </div>

            {/* Spec 7: Folder Organization */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <FolderOpen className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  Organization
                </span>
              </div>
              <h4 className="font-bold text-sm">Deep Folder Nesting</h4>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Create a real file structure. Clients Q4 Campaign A. Stop
                dumping everything into one "Uploads" bucket.
              </p>
            </div>

            {/* Spec 8: Fair Pricing */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-brand-primary">
                <Check className="w-4 h-4" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  Billing
                </span>
              </div>
              <h4 className="font-bold text-sm">No "Seat Tax"</h4>
              <p className="text-xs text-foreground/70 leading-relaxed">
                We charge based on value (brands managed), not headcount. Invite
                your writer, your designer, and your client without upgrading
                plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
