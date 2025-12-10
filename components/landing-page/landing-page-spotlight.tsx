// components/landing-page/landing-page-spotlight.tsx

import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Music2,
  AtSign,
  Pin,
  Hammer,
  Split,
  MessageCircle,
  Layers,
  Tag,
  EyeOff,
  Baby,
  Fingerprint,
  FolderOpen,
  CalendarDays,
  BarChart3,
  Clock,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PlatformSpecsLedger from "./platform-specs-ledger";

export default function LandingPageSpotlight() {
  return (
    <section className="bg-background-editorial text-foreground py-20 border-b border-foreground overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        {/* SECTION HEADER */}
        <div className="mb-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-foreground" />
          <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1 font-bold">
            The Feature Ledger
          </span>
          <div className="flex-1 h-px bg-foreground" />
        </div>

        {/* 
           THE NEWSPAPER GRID 
           Strategy: bg-foreground with gap-px creates the grid lines. 
           Children use bg-background-editorial to hide the black, revealing only the 1px gap.
        */}
        <div className="bg-foreground border-2 border-foreground gap-px grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-sm">
          {/* --- ROW 1: HEADLINE STORY & SIDEBAR --- */}

          {/* 1. THE MEDIA ROOM (Lead Story) - Spans 8 cols */}
          <div className="md:col-span-8 bg-background-editorial p-8 md:p-12 flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-brand-primary rounded-full" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60 font-bold">
                  Asset Management
                </span>
              </div>
              <h3 className="font-serif text-4xl md:text-5xl font-medium mb-6 leading-[0.95]">
                The Media Room
              </h3>
              <p className="font-serif text-lg text-foreground/80 max-w-lg leading-relaxed">
                Your media library that finally feels sane. Folders, smart
                deduplication, and search. Crop once for everything, or get
                specific at post-time. We handle aspect ratios and format
                conversions.
              </p>
            </div>

            {/* Visual Abstract */}
            <div className="mt-12 grid grid-cols-4 gap-px bg-foreground/10 border border-foreground/10 h-32 opacity-60">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-background-editorial relative">
                  <div className="absolute inset-2 bg-foreground/5" />
                </div>
              ))}
            </div>
          </div>

          {/* 2. THE CALENDAR (Sidebar) - Spans 4 cols, vertically tall */}
          <div className="md:col-span-4 md:row-span-2 bg-background-editorial p-8 border-l-0 md:border-l-0 relative flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60 font-bold">
                Scheduling
              </span>
              <CalendarDays className="w-4 h-4 text-brand-primary" />
            </div>

            <h3 className="font-serif text-3xl font-medium mb-4">
              The Calendar
            </h3>
            <p className="font-serif text-sm text-foreground/70 mb-8 leading-relaxed">
              Your entire strategy at a glance. Drag to reschedule, click to
              edit. Filter by workspace or channel.
            </p>

            {/* Calendar Visual Abstract */}
            <div className="flex-1 w-full bg-surface border border-foreground/10 p-4 flex flex-col gap-2 opacity-80">
              <div className="flex justify-between border-b border-foreground/10 pb-2 mb-2">
                <div className="w-1/3 h-2 bg-foreground/20" />
                <div className="w-1/4 h-2 bg-foreground/10" />
              </div>
              <div className="grid grid-cols-7 gap-1 h-full">
                {[...Array(28)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "bg-foreground/5 rounded-sm",
                      i === 12 &&
                        "bg-brand-primary/20 ring-1 ring-brand-primary"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* --- ROW 2: THE OPERATIONS STRIP --- */}

          {/* 3. ANALYTICS - Spans 4 cols */}
          <div className="md:col-span-4 bg-background-editorial p-8 flex flex-col justify-between">
            <div className="mb-4">
              <BarChart3 className="w-6 h-6 text-brand-primary mb-3" />
              <h3 className="font-serif text-2xl font-medium mb-2">
                Analytics
              </h3>
              <p className="font-serif text-xs text-foreground/70 leading-relaxed">
                One aggregated "Total Reach" number across X, LinkedIn, and
                TikTok. Proof of performance.
              </p>
            </div>
            <div className="h-1 w-full bg-foreground/10 mt-4 overflow-hidden">
              <div className="h-full w-[65%] bg-brand-primary" />
            </div>
          </div>

          {/* 4. CONNECTIVITY - Spans 4 cols */}
          <div className="md:col-span-4 bg-background-editorial p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60 font-bold">
                Connectivity
              </span>
            </div>
            <h3 className="font-serif text-2xl font-medium mb-4">
              Every Platform
            </h3>
            <div className="grid grid-cols-4 gap-4 mt-6 opacity-70">
              <Twitter className="w-5 h-5" />
              <Instagram className="w-5 h-5" />
              <Linkedin className="w-5 h-5" />
              <Facebook className="w-5 h-5" />
              <Youtube className="w-5 h-5" />
              <Music2 className="w-5 h-5" />
              <AtSign className="w-5 h-5" />
              <Pin className="w-5 h-5" />
            </div>
          </div>

          {/* --- ROW 3: EDITORIAL DESK (Featured) --- */}
          {/* Spans 8 cols */}
          <div className="md:col-span-8 bg-brand-primary text-brand-primary-foreground p-8 md:p-10 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-serif text-3xl font-medium mb-4">
                The Editorial Desk
              </h3>
              <p className="font-serif text-sm md:text-base text-brand-primary-foreground/90 max-w-2xl leading-relaxed">
                One place to inspire, create, and publish. Write your main
                caption, select channels, make per-platform tweaks, and ship it
                all without leaving the desk.
              </p>
            </div>
            <div className="absolute right-[-20px] bottom-[-40px] opacity-10 rotate-12">
              <Layers className="w-48 h-48" />
            </div>
          </div>

          {/* 5. Placeholder / Fill for grid balance (Cols 9-12 covered by Calendar row-span) */}
          {/* Note: In CSS Grid with gap-px, empty divs are fine or the auto-flow handles it. 
              Since Calendar is row-span-2, it occupies this space in column 3. 
              Wait, row 2 is Analytics/Connectivity. 
              Row 3 is Editorial Desk (8) + Calendar (bottom half). 
              Let's adjust layouts slightly to ensure clean 12-col fit.
          */}

          {/* --- ROW 4: THE OPINION COLUMNS (Text Heavy) --- */}

          <div className="md:col-span-4 bg-background-editorial p-8 border-t-0">
            <h4 className="font-serif text-xl font-bold mb-3 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-brand-primary" /> Silos that
              work.
            </h4>
            <p className="font-serif text-sm text-foreground/80 leading-relaxed">
              Most tools lump everything together. We use distinct Workspaces
              with their own timezones, libraries, and tags. Your personal brand
              never touches your client work.
            </p>
          </div>

          <div className="md:col-span-4 bg-background-editorial p-8 border-t-0">
            <h4 className="font-serif text-xl font-bold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-primary" /> Review &
              Approve.
            </h4>
            <p className="font-serif text-sm text-foreground/80 leading-relaxed">
              Whether it's a client sign-off or just a second pair of eyes, our
              built-in approval workflows ensure nothing goes live by accident.
            </p>
          </div>

          <div className="md:col-span-4 bg-background-editorial p-8 border-t-0">
            <h4 className="font-serif text-xl font-bold mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-primary" /> Timezone
              Sovereignty.
            </h4>
            <p className="font-serif text-sm text-foreground/80 leading-relaxed">
              When your client is in NY and you are in Tokyo, 9 AM means 9 AM
              for them. Each workspace runs on its own clock.
            </p>
          </div>
          <PlatformSpecsLedger />
        </div>
      </div>
    </section>
  );
}
