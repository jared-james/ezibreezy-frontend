// app/(app)/ideas/ideas-client.tsx

"use client";

import { useState } from "react";
import { Lightbulb, Archive, PenSquare } from "lucide-react";
import PageHeading from "./components/page-heading";
import AIBriefing from "./components/ai-briefing";
import LatestBriefing from "./components/latest-briefing";
import NewClipping from "./components/new-clipping";
import IdeaClippings from "./components/idea-clippings";
import type { Clipping as GeneratedClipping } from "@/lib/api/ideas";
import { cn } from "@/lib/utils";

type MainTab = "ai" | "manual" | "archive";

interface IdeasClientProps {
  workspaceId: string;
}

export default function IdeasClient({ workspaceId }: IdeasClientProps) {
  const [mainTab, setMainTab] = useState<MainTab>("ai");
  const [latestBriefing, setLatestBriefing] = useState<GeneratedClipping[]>([]);

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
      <PageHeading />

      <div className="mb-8 flex items-center border-b border-border">
        <button
          type="button"
          onClick={() => setMainTab("ai")}
          className={cn(
            "flex -mb-0.5 items-center gap-3 border-b-4 p-4 font-serif text-lg",
            mainTab === "ai"
              ? "border-brand-accent font-bold text-foreground"
              : "border-transparent text-foreground/50 hover:text-foreground"
          )}
        >
          <Lightbulb className="h-5 w-5" />
          AI Briefing
        </button>

        <button
          type="button"
          onClick={() => setMainTab("manual")}
          className={cn(
            "flex -mb-0.5 items-center gap-3 border-b-4 p-4 font-serif text-lg",
            mainTab === "manual"
              ? "border-brand-accent font-bold text-foreground"
              : "border-transparent text-foreground/50 hover:text-foreground"
          )}
        >
          <PenSquare className="h-5 w-5" />
          New Clipping
        </button>

        <button
          type="button"
          onClick={() => setMainTab("archive")}
          className={cn(
            "flex -mb-0.5 items-center gap-3 border-b-4 p-4 font-serif text-lg",
            mainTab === "archive"
              ? "border-brand-accent font-bold text-foreground"
              : "border-transparent text-foreground/50 hover:text-foreground"
          )}
        >
          <Archive className="h-5 w-5" />
          Idea Clippings
        </button>
      </div>

      {mainTab === "ai" && (
        <div className="space-y-8">
          <AIBriefing
            workspaceId={workspaceId}
            onNewBriefingGenerated={setLatestBriefing}
          />
          <LatestBriefing clippings={latestBriefing} />
        </div>
      )}

      {mainTab === "manual" && <NewClipping />}

      {mainTab === "archive" && <IdeaClippings />}
    </div>
  );
}
