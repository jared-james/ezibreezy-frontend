// app/(app)/ideas/components/IdeaClippings.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag, X } from "lucide-react";

// Mock data
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
      <div className="flex items-center justify-end border-b-2 border-[--foreground] pb-3 mb-8">
        <div className="flex items-center gap-2 border border-[--border] p-1 bg-[--surface]">
          {ideaLifecycleFilters.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilterTab(tab)}
              className={`py-1 px-3 text-xs uppercase tracking-wider font-bold ${
                activeFilterTab === tab
                  ? "bg-[--foreground] text-[--background]"
                  : "text-[--muted] hover:bg-[--surface-hover]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[--card] border border-[--border] p-5 group flex flex-col justify-between hover:border-[--foreground] transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[--foreground] bg-[--surface] py-1 px-2 border border-[--border]">
                {savedIdea.status}
              </span>
              <span className="text-xs font-serif text-[--muted-foreground] italic">
                {savedIdea.date}
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[--foreground] mb-2">
              {savedIdea.title}
            </h3>
            <p className="font-serif text-sm text-[--muted] leading-relaxed mb-4 line-clamp-4">
              {savedIdea.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Tag className="w-3 h-3 text-[--muted-foreground]" />
              {savedIdea.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.7rem] uppercase tracking-wider text-[--muted]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t-2 border-dashed border-[--border]">
            <p className="eyebrow text-sm mb-3">Format for Platform</p>
            <div className="flex flex-wrap items-center gap-3">
              {ideaPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() =>
                    setFormattingPlatform(
                      formattingPlatform === platform.id
                        ? null
                        : platform.id
                    )
                  }
                  title={platform.name}
                  className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors ${
                    formattingPlatform === platform.id
                      ? "bg-[--foreground] text-[--background] border-[--foreground]"
                      : "bg-white border-[--border] hover:border-[--muted]"
                  }`}
                >
                  <span className="font-serif font-bold text-xs">
                    {platform.initial}
                  </span>
                </button>
              ))}
            </div>

            {formattingPlatform === "x" && (
              <div className="mt-4 bg-white p-4 border border-[--border] animate-in fade-in-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif font-bold text-sm">
                    Format for X
                  </h4>
                  <button
                    onClick={() => setFormattingPlatform(null)}
                    className="text-[--muted] hover:text-[--foreground]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={10}
                  className="w-full text-sm font-mono bg-[--surface] p-3 border border-[--border] focus:border-[--foreground] focus:ring-1 focus:ring-[--foreground] transition-colors"
                  defaultValue={getXFormattedText()}
                />
                <div className="flex justify-end mt-3">
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
