// app/(app)/ideas/page.tsx

"use client";

import { useState } from "react";
import { Lightbulb, Archive, PenSquare, Settings } from "lucide-react";
import PageHeading from "./components/page-heading";
import AIBriefing from "./components/ai-briefing";
import LatestBriefing from "./components/latest-briefing";
import NewClipping from "./components/new-clipping";
import IdeaClippings from "./components/idea-clippings";
import EditClippingModal from "./components/edit-clipping-modal";
import type { Clipping as GeneratedClipping } from "@/lib/api/ideas";
import type { Clipping } from "@/lib/types/editorial";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockClipping: Clipping = {
  id: "mock-1",
  title: "Holiday Marketing Campaign Ideas",
  body: "Share 5 creative ways small businesses can boost holiday sales without breaking the bank. Focus on social media tactics, email marketing, and customer engagement strategies that deliver real ROI.",
  tags: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: "mock-user",
};

type MainTab = "ai" | "manual" | "archive";

export default function IdeasPage() {
  const [mainTab, setMainTab] = useState<MainTab>("ai");
  const [latestBriefing, setLatestBriefing] = useState<GeneratedClipping[]>([]);
  const [showDevModal, setShowDevModal] = useState(false);

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
      <PageHeading />

      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => setShowDevModal(true)}
          size="sm"
          className="gap-2 border border-purple-300 bg-purple-100 text-purple-700 hover:bg-purple-200"
        >
          <Settings className="h-4 w-4" />
          Test Modal
        </Button>
      </div>

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
          <AIBriefing onNewBriefingGenerated={setLatestBriefing} />
          <LatestBriefing clippings={latestBriefing} />
        </div>
      )}

      {mainTab === "manual" && <NewClipping />}

      {mainTab === "archive" && <IdeaClippings />}

      <EditClippingModal
        isOpen={showDevModal}
        onClose={() => setShowDevModal(false)}
        idea={mockClipping}
      />
    </div>
  );
}
