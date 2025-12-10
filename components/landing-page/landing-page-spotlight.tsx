// components/landing-page/landing-page-spotlight.tsx

import {
  Layers,
  FolderOpen,
  CalendarDays,
  BarChart3,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { cn } from "@/lib/utils";
import PlatformSpecsLedger from "./platform-specs-ledger";

export default function LandingPageSpotlight() {
  // Shared border styles for uniform "thin ink" look
  // border-foreground/20 is much lighter than the previous solid black
  const solidBorder = "border-foreground/20";
  const dashedBorder = "border-foreground/30 border-dashed";

  return (
    <section className="bg-background-editorial text-foreground py-20 border-b border-foreground/20 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        {/* SECTION HEADER */}
        <div className="mb-12 flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-foreground/20" />
          <span className="font-mono text-xs uppercase tracking-widest bg-foreground text-background-editorial px-3 py-1">
            The Feature Ledger
          </span>
          <div className="flex-1 h-[1px] bg-foreground/20" />
        </div>

        {/* 
           THE NEWSPAPER GRID 
           Changed: Removed `gap-px bg-foreground`. 
           Now using `gap-0` with explicit borders on children for finer control.
           Added an outer border to frame the "paper".
        */}
        <div
          className={`border ${solidBorder} gap-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-sm`}
        >
          {/* --- ROW 1: HEADLINE STORY & SIDEBAR --- */}

          {/* 1. THE MEDIA ROOM (Lead Story) - Spans 8 cols */}
          <div
            className={`md:col-span-8 bg-background-editorial p-8 md:p-12 flex flex-col justify-between min-h-[400px] border-b md:border-b-0 md:border-r ${solidBorder}`}
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-brand-primary rounded-full opacity-80" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                  Asset Management
                </span>
              </div>
              <h3 className="font-serif text-4xl md:text-5xl font-medium mb-6 leading-[0.95] tracking-tight">
                The Media Room
              </h3>
              <p className="font-serif text-lg text-foreground/80 max-w-lg leading-relaxed">
                Your media library that finally feels sane. Folders, smart
                deduplication, and search. Crop once for everything, or get
                specific at post-time. We handle aspect ratios and format
                conversions.
              </p>
            </div>

            {/* Visual Abstract - Lightened borders */}
            <div
              className={`mt-12 grid grid-cols-4 gap-px bg-foreground/10 border ${solidBorder} h-32 opacity-60`}
            >
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-background-editorial relative">
                  <div className="absolute inset-2 bg-foreground/5" />
                </div>
              ))}
            </div>
          </div>

          {/* 2. THE CALENDAR (Sidebar) - Spans 4 cols, vertically tall */}
          {/* Note: This spans 2 rows. It needs a bottom border to separate from items below it. */}
          <div
            className={`md:col-span-4 md:row-span-2 bg-background-editorial p-8 border-b ${solidBorder} relative flex flex-col`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                Scheduling
              </span>
              <CalendarDays className="w-4 h-4 text-brand-primary/80" />
            </div>

            <h3 className="font-serif text-3xl font-medium mb-4">
              The Calendar
            </h3>
            <p className="font-serif text-sm text-foreground/70 mb-8 leading-relaxed">
              Your entire strategy at a glance. Drag to reschedule, click to
              edit. Filter by workspace or channel.
            </p>

            {/* Calendar Visual Abstract */}
            <div
              className={`flex-1 w-full bg-surface border ${solidBorder} p-4 flex flex-col gap-2 opacity-80`}
            >
              <div
                className={`flex justify-between border-b ${solidBorder} pb-2 mb-2`}
              >
                <div className="w-1/3 h-2 bg-foreground/10" />
                <div className="w-1/4 h-2 bg-foreground/5" />
              </div>
              <div className="grid grid-cols-7 gap-1 h-full">
                {[...Array(28)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "bg-foreground/5 rounded-[1px]",
                      i === 12 &&
                        "bg-brand-primary/20 ring-1 ring-brand-primary/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* --- ROW 2: THE OPERATIONS STRIP --- */}

          {/* 3. ANALYTICS - Spans 4 cols */}
          {/* Needs Right border to separate from Connectivity */}
          <div
            className={`md:col-span-4 bg-background-editorial p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r ${solidBorder}`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                Performance
              </span>
              <BarChart3 className="w-4 h-4 text-brand-primary/80" />
            </div>

            <div>
              <h3 className="font-serif text-3xl font-medium mb-4">
                Analytics
              </h3>
              <p className="font-serif text-sm text-foreground/70 leading-relaxed">
                One aggregated "Total Reach" number across X, LinkedIn, and
                TikTok. Proof of performance.
              </p>
            </div>

            <div className="h-[2px] w-full bg-foreground/10 mt-8 overflow-hidden">
              <div className="h-full w-[65%] bg-brand-primary/80" />
            </div>
          </div>

          {/* 4. CONNECTIVITY - Spans 4 cols */}
          {/* Needs Right border to separate from the Calendar (which is to its right in the grid flow) */}
          <div
            className={`md:col-span-4 bg-background-editorial p-8 border-b md:border-b-0 md:border-r ${solidBorder}`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                Connectivity
              </span>
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500/80"></span>
              </div>
            </div>

            <h3 className="font-serif text-3xl font-medium mb-4">
              Every Platform
            </h3>

            <div className="grid grid-cols-4 gap-4 mt-8 opacity-60">
              <SocialIcon
                network="x"
                style={{ height: 35, width: 35 }}
                bgColor="transparent"
                fgColor="currentColor"
              />
              <SocialIcon
                network="instagram"
                style={{ height: 35, width: 35 }}
                bgColor="transparent"
                fgColor="currentColor"
              />
              <SocialIcon
                network="linkedin"
                style={{ height: 35, width: 35 }}
                bgColor="transparent"
                fgColor="currentColor"
              />
              <SocialIcon
                network="facebook"
                style={{ height: 35, width: 35 }}
                bgColor="transparent"
                fgColor="currentColor"
              />
              <SocialIcon
                network="youtube"
                style={{ height: 35, width: 35 }}
                bgColor="transparent"
                fgColor="currentColor"
              />
              <SocialIcon
                network="tiktok"
                style={{ height: 35, width: 35 }}
                bgColor="transparent"
                fgColor="currentColor"
              />
              <SocialIcon
                network="threads"
                style={{ height: 35, width: 35 }}
                bgColor="transparent"
                fgColor="currentColor"
              />
              <SocialIcon
                network="pinterest"
                style={{ height: 35, width: 35 }}
                bgColor="transparent"
                fgColor="currentColor"
              />
            </div>
          </div>

          {/* --- ROW 3: EDITORIAL DESK (Featured) --- */}
          {/* Spans 8 cols. We add a dashed bottom border here to separate the top "Features" from the bottom "Opinions" */}
          <div
            className={`md:col-span-8 bg-brand-primary text-brand-primary-foreground p-8 md:p-10 relative overflow-hidden border-b ${dashedBorder} md:border-r ${solidBorder}`}
          >
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

          {/* --- ROW 4: THE OPINION COLUMNS (Text Heavy) --- */}
          {/* We use DASHED borders here for the "Classifieds" look */}

          {/* WORKSPACES: Sits to the right of Editorial Desk in the flow */}
          <div
            className={`md:col-span-4 bg-background-editorial p-8 border-b ${dashedBorder}`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                Organisations & Workspaces
              </span>
              <FolderOpen className="w-4 h-4 text-brand-primary/80" />
            </div>

            <h4 className="font-serif text-3xl font-medium mb-4">
              Invite your team
            </h4>
            <p className="font-serif text-sm text-foreground/70 leading-relaxed">
              Invite collaborators and assign specific roles to maintain control
              over your content. Manage who can view, edit, or administer each
              workspace.
            </p>
          </div>

          {/* WORKFLOW */}
          <div
            className={`md:col-span-4 bg-background-editorial p-8 border-b md:border-b-0 md:border-r ${dashedBorder}`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                Workflow
              </span>
              <ShieldCheck className="w-4 h-4 text-brand-primary/80" />
            </div>

            <h4 className="font-serif text-3xl font-medium mb-4">
              Review & Approve.
            </h4>
            <p className="font-serif text-sm text-foreground/70 leading-relaxed">
              Whether it's a client sign-off or just a second pair of eyes, our
              built-in approval workflows ensure nothing goes live by accident.
            </p>
          </div>

          {/* GLOBAL */}
          <div
            className={`md:col-span-4 bg-background-editorial p-8 border-b md:border-b-0 md:border-r ${dashedBorder}`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 font-bold">
                Global
              </span>
              <Globe className="w-4 h-4 text-brand-primary/80" />
            </div>

            <h4 className="font-serif text-3xl font-medium mb-4">
              Timezone Sovereignty.
            </h4>
            <p className="font-serif text-sm text-foreground/70 leading-relaxed">
              When your client is in NY and you are in Tokyo, 9 AM means 9 AM
              for them. Each workspace runs on its own clock.
            </p>
          </div>

          {/* LEDGER - Assuming this component handles its own internal layout, 
              we leave it as is, but it sits inside the grid so it will flow naturally. 
              The previous element (Global) didn't close the row (it was col 5-8 effectively),
              so Ledger might need to ensure it clears or starts fresh depending on its internal definition.
          */}
          <PlatformSpecsLedger />
        </div>
      </div>
    </section>
  );
}
