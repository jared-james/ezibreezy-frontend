// components/landing-page/landing-page-spotlight.tsx

import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Music2,
  AtSign,
  Hash,
  Users,
  ShieldCheck,
  Globe,
  Moon,
  Layers,
  Zap,
  Pin,
  Store,
  Cloud,
  Check,
} from "lucide-react";

export default function LandingPageSpotlight() {
  return (
    <section className="relative bg-background-editorial text-foreground py-24 px-6 border-b-4 border-foreground overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* HEADER: The Ledger */}
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
            <p className="font-serif italic text-2xl">Vol. 1 — Full Suite</p>
          </div>
        </div>

        {/* THE BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-[minmax(300px,auto)]">
          {/* MEDIA ROOM */}
          <div className="md:col-span-6 lg:col-span-7 bg-surface border-2 border-foreground p-8 relative group overflow-hidden hover:shadow-[8px_8px_0_0_var(--foreground)] transition-all duration-300">
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-brand-primary rounded-full" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                    Asset Management
                  </span>
                </div>
                <h3 className="font-serif text-4xl font-medium mb-4">
                  The Media Room
                </h3>
                <p className="font-serif text-lg text-foreground/70 max-w-md">
                  A visual home for your creative assets. Organize by folder,
                  tag by product, and visualize your aesthetic grid before
                  posting.
                </p>
              </div>

              {/* Instagram Grid Visual */}
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

          {/* UNIVERSAL BROADCAST */}
          <div className="md:col-span-6 lg:col-span-5 bg-surface-hover border-2 border-foreground p-8 relative group hover:shadow-[8px_8px_0_0_var(--foreground)] transition-all duration-300 flex flex-col">
            <div className="mb-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-foreground rounded-full" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                  Connectivity
                </span>
              </div>
              <h3 className="font-serif text-3xl font-medium mb-4">
                Universal Signal
              </h3>
              <p className="font-serif text-base text-foreground/70">
                Connect everything. No per-channel pricing. Your plan includes
                access to the full network.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-5 gap-3">
              {[
                { icon: Twitter, label: "X" },
                { icon: Instagram, label: "IG" },
                { icon: Linkedin, label: "LI" },
                { icon: Facebook, label: "FB" },
                { icon: Youtube, label: "YT" },
                { icon: Music2, label: "TT" },
                { icon: AtSign, label: "TH" },
                { icon: Pin, label: "PIN" },
                { icon: Store, label: "GMB" },
                { icon: Cloud, label: "BS" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="aspect-square flex flex-col items-center justify-center border-2 border-foreground bg-surface hover:bg-foreground hover:text-background-editorial transition-colors cursor-default group/icon"
                >
                  <p.icon className="w-6 h-6 mb-1" />
                  <span className="font-mono text-[8px] uppercase font-bold opacity-50 group-hover/icon:opacity-100">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MANAGEMENT SUITE */}
          <div className="md:col-span-6 lg:col-span-4 bg-surface border-2 border-foreground p-8 relative group hover:translate-y-1 transition-transform">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-brand-primary rounded-full" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                Command & Control
              </span>
            </div>

            <h3 className="font-serif text-2xl font-medium mb-6">
              Workspaces & Teams
            </h3>

            <ul className="space-y-4 font-serif text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <Users className="w-4 h-4 mt-1 text-brand-primary" />
                <span>Invite your team. Roles without per-seat fees.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 mt-1 text-brand-primary" />
                <span>
                  Approval workflows. Nothing goes live unintentionally.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Layers className="w-4 h-4 mt-1 text-brand-primary" />
                <span>Campaign grouping. Organize by project or season.</span>
              </li>
            </ul>
          </div>

          {/* CLIENT ACCESS */}
          <div className="md:col-span-6 lg:col-span-4 bg-surface border-2 border-foreground p-8 relative group hover:shadow-[8px_8px_0_0_var(--foreground)] transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                External
              </span>
            </div>

            <h3 className="font-serif text-2xl font-medium mb-4">
              Client Access
            </h3>

            <p className="font-serif text-sm text-foreground/70 mb-6">
              Share a live, read-only link to your calendar. Clients see the
              schedule—no account needed.
            </p>

            <div className="rounded-sm p-4 flex items-center gap-3 bg-surface-hover border border-foreground/20">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-brand-primary-foreground border border-foreground flex items-center justify-center font-bold text-xs">
                Ez
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-2 w-24 bg-foreground/10 rounded-sm mb-1" />
                <div className="h-1.5 w-full bg-foreground/5 rounded-sm" />
              </div>
              <div className="px-2 py-1 bg-surface border border-foreground/10 text-[9px] uppercase font-bold tracking-wider rounded-sm">
                Public
              </div>
            </div>
          </div>

          {/* IDEA ENGINE */}
          <div className="md:col-span-6 lg:col-span-4 bg-brand-primary border-2 border-foreground p-8 relative group hover:shadow-[8px_8px_0_0_var(--foreground)] transition-all duration-300 text-brand-primary-foreground">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                Generation
              </span>
            </div>

            <h3 className="font-serif text-2xl font-medium mb-4">
              Idea Engine
            </h3>

            <p className="font-serif text-sm text-foreground/80">
              Don't start from zero. Our briefing system transforms raw notes
              into polished drafts tailored to your voice.
            </p>

            <div className="absolute bottom-4 right-4 opacity-10 rotate-12">
              <span className="font-serif text-9xl font-black">AI</span>
            </div>
          </div>

          {/* EXTRAS STRIP */}
          <div className="col-span-1 md:col-span-6 lg:col-span-12 bg-foreground text-background-editorial border-2 border-foreground relative overflow-hidden group p-0">
            <div className="h-1 w-full bg-brand-primary absolute top-0 left-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-background-editorial/10">
              {/* Dark Mode */}
              <div className="p-8 flex items-start gap-4 hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full border border-background-editorial/20 flex overflow-hidden shrink-0">
                  <div className="w-1/2 bg-background-editorial" />
                  <div className="w-1/2 bg-[#222]" />
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg">System Dark</h4>
                  <p className="font-serif text-sm text-background-editorial/60 mt-1 leading-relaxed">
                    Native dark mode support for late-night editorial sessions.
                  </p>
                </div>
              </div>

              {/* Unified Feed */}
              <div className="p-8 flex items-start gap-4 hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 border border-background-editorial/20 flex flex-col gap-1 p-2 justify-center shrink-0 bg-background-editorial/5">
                  <div className="w-full h-0.5 bg-white/40" />
                  <div className="w-2/3 h-0.5 bg-white/40" />
                  <div className="w-full h-0.5 bg-white/40" />
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg flex items-center gap-2">
                    Unified Feed
                  </h4>
                  <p className="font-serif text-sm text-background-editorial/60 mt-1 leading-relaxed">
                    A single stream for all comments and notifications.
                    <span className="text-brand-primary text-xs uppercase tracking-wider ml-1">
                      Coming Soon
                    </span>
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="p-8 flex flex-col justify-center items-center text-center bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary-hover transition-colors">
                <div className="mb-2 border-2 border-foreground rounded-full p-1">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-xl uppercase tracking-tight">
                  One Fair Price
                </h4>
                <p className="font-mono text-xs uppercase tracking-widest mt-1 opacity-80">
                  Includes Everything
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
