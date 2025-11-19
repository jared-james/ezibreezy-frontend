// app/(app)/ideas/components/idea-clippings.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

const savedIdea = {
  status: "Saved",
  title: "Exploring the Local Impact of Urban Farming",
  description:
    "A feature piece on how community gardens and rooftop farms are changing the local food landscape. Core themes include food security, community building, and sustainable urban living. Potential angles include a profile on a local garden, an interview with a city planner, and a 'how-to' guide for starting a small balcony garden.",
  tags: ["Community", "Sustainability", "Local"],
  date: "4 days ago",
};

const ideaPlatforms = [
  { id: "x", name: "X / Twitter", initial: "X" },
  { id: "instagram", name: "Instagram", initial: "I" },
  { id: "linkedin", name: "LinkedIn", initial: "L" },
  { id: "facebook", name: "Facebook", initial: "F" },
  { id: "reddit", name: "Reddit", initial: "R" },
  { id: "tiktok", name: "TikTok", initial: "T" },
  { id: "threads", name: "Threads", initial: "Th" },
  { id: "pinterest", name: "Pinterest", initial: "P" },
];

const ideaLifecycleFilters = [
  "All Ideas",
  "Saved",
  "Developed",
  "Drafted",
  "Posted",
];

const getXFormattedText = () => {
  return `▪️ HOOK: Is urban farming the future of our cities? 🥬

▪️ CORE MESSAGE: Community gardens are transforming local food landscapes, boosting sustainability and connection.

▪️ KEY POINTS:
  - Enhances food security
  - Builds stronger communities
  - Promotes green living

▪️ ENGAGEMENT: What are your thoughts on growing food locally?

#UrbanFarming #Sustainability #Community`;
};

export default function IdeaClippings() {
  const [activeFilterTab, setActiveFilterTab] = useState("All Ideas");
  const [formattingPlatform, setFormattingPlatform] = useState<string | null>(
    null
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-end border-b-2 border-foreground pb-3">
        <div className="flex items-center gap-2 border border-border bg-surface p-1">
          {ideaLifecycleFilters.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilterTab(tab)}
              className={cn(
                "px-3 py-1 text-xs font-bold uppercase tracking-wider",
                activeFilterTab === tab
                  ? "bg-foreground text-background"
                  : "text-muted hover:bg-surface-hover"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="group flex flex-col justify-between border border-border bg-card p-5 transition-colors hover:border-foreground">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="border border-border bg-surface px-2 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-foreground">
                {savedIdea.status}
              </span>
              <span className="font-serif text-xs italic text-muted-foreground">
                {savedIdea.date}
              </span>
            </div>

            <h3 className="mb-2 font-serif text-xl font-bold text-foreground">
              {savedIdea.title}
            </h3>
            <p className="mb-4 line-clamp-4 font-serif text-sm leading-relaxed text-muted-foreground">
              {savedIdea.description}
            </p>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {savedIdea.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.7rem] uppercase tracking-wider text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-dashed border-border pt-4">
            <p className="eyebrow mb-3 text-sm">Format for Platform</p>
            <div className="flex flex-wrap items-center gap-3">
              {ideaPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() =>
                    setFormattingPlatform(
                      formattingPlatform === platform.id ? null : platform.id
                    )
                  }
                  title={platform.name}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
                    formattingPlatform === platform.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-surface hover:border-muted"
                  )}
                >
                  <span className="font-serif text-xs font-bold">
                    {platform.initial}
                  </span>
                </button>
              ))}
            </div>

            {formattingPlatform === "x" && (
              <div className="mt-4 animate-in fade-in-50 border border-border bg-surface p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold">Format for X</h4>
                  <button
                    onClick={() => setFormattingPlatform(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  rows={10}
                  className="w-full border border-border bg-surface p-3 font-mono text-sm transition-colors focus:border-foreground focus:ring-1 focus:ring-foreground"
                  defaultValue={getXFormattedText()}
                />
                <div className="mt-3 flex justify-end">
                  <Link href="/editorial" className="btn btn-sm">
                    Develop in Editorial →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
