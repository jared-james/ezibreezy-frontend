// app/(app)/ideas/page.tsx

"use client";

import { useState } from "react";
import { Lightbulb, Archive, PenSquare } from "lucide-react";
import PageHeading from "./components/PageHeading";
import AIBriefing from "./components/AIBriefing";
import LatestBriefing from "./components/LatestBriefing";
import NewClipping from "./components/NewClipping";
import IdeaClippings from "./components/IdeaClippings";
import type { Clipping } from "@/lib/api-client";

export default function IdeasPage() {
  const [mainTab, setMainTab] = useState<"ai" | "manual" | "archive">("ai");
  const [latestBriefing, setLatestBriefing] = useState<Clipping[]>([]);

  return (
    <div className="h-full flex flex-col w-full max-w-7xl mx-auto p-4 md:p-6">
      <PageHeading />
      <div className="flex items-center border-b-2 border-[--foreground] mb-8">
        <button
          onClick={() => setMainTab("ai")}
          className={`flex items-center gap-3 p-4 text-lg font-serif border-b-4 -mb-[2px] ${
            mainTab === "ai"
              ? "font-bold border-[--brand-accent]"
              : "border-transparent text-[--muted] hover:text-[--foreground]"
          }`}
        >
          <Lightbulb className="w-5 h-5" /> AI Briefing
        </button>
        <button
          onClick={() => setMainTab("manual")}
          className={`flex items-center gap-3 p-4 text-lg font-serif border-b-4 -mb-[2px] ${
            mainTab === "manual"
              ? "font-bold border-[--brand-accent]"
              : "border-transparent text-[--muted] hover:text-[--foreground]"
          }`}
        >
          <PenSquare className="w-5 h-5" /> New Clipping
        </button>
        <button
          onClick={() => setMainTab("archive")}
          className={`flex items-center gap-3 p-4 text-lg font-serif border-b-4 -mb-[2px] ${
            mainTab === "archive"
              ? "font-bold border-[--brand-accent]"
              : "border-transparent text-[--muted] hover:text-[--foreground]"
          }`}
        >
          <Archive className="w-5 h-5" /> Idea Clippings
        </button>
      </div>

      {mainTab === "ai" && (
        <div className="space-y-8">
          <AIBriefing onNewBriefingGenerated={setLatestBriefing} />
          <LatestBriefing clippings={latestBriefing} />
        </div>
      )}

      {mainTab === "manual" && <NewClipping />}

      {mainTab === "archive" && <IdeaClippings />}
    </div>
  );
}
