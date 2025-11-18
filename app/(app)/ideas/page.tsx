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
import type { Clipping } from "@/lib/api/ideas";
import { Button } from "@/components/ui/button";

const mockClipping: Clipping = {
  id: "mock-1",
  title: "Holiday Marketing Campaign Ideas",
  body: "Share 5 creative ways small businesses can boost holiday sales without breaking the bank. Focus on social media tactics, email marketing, and customer engagement strategies that deliver real ROI.",
  tags: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: "mock-user",
};

export default function IdeasPage() {
  const [mainTab, setMainTab] = useState<"ai" | "manual" | "archive">("ai");
  const [latestBriefing, setLatestBriefing] = useState<Clipping[]>([]);
  const [showDevModal, setShowDevModal] = useState(false);

  return (
    <div className="h-full flex flex-col w-full max-w-7xl mx-auto p-4 md:p-6">
      <PageHeading />

      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => setShowDevModal(true)}
          size="sm"
          className="gap-2 bg-purple-100 border border-purple-300 text-purple-700 hover:bg-purple-200"
        >
          <Settings className="w-4 h-4" />
          Test Modal
        </Button>
      </div>

      <div className="flex items-center border-b border-border mb-8">
        <button
          type="button"
          onClick={() => setMainTab("ai")}
          className={`flex items-center gap-3 p-4 text-lg font-serif border-b-4 -mb-[2px] ${
            mainTab === "ai"
              ? "font-bold border-brand-accent text-foreground"
              : "border-transparent text-foreground/50 hover:text-foreground"
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          AI Briefing
        </button>

        <button
          type="button"
          onClick={() => setMainTab("manual")}
          className={`flex items-center gap-3 p-4 text-lg font-serif border-b-4 -mb-[2px] ${
            mainTab === "manual"
              ? "font-bold border-brand-accent text-foreground"
              : "border-transparent text-foreground/50 hover:text-foreground"
          }`}
        >
          <PenSquare className="w-5 h-5" />
          New Clipping
        </button>

        <button
          type="button"
          onClick={() => setMainTab("archive")}
          className={`flex items-center gap-3 p-4 text-lg font-serif border-b-4 -mb-[2px] ${
            mainTab === "archive"
              ? "font-bold border-brand-accent text-foreground"
              : "border-transparent text-foreground/50 hover:text-foreground"
          }`}
        >
          <Archive className="w-5 h-5" />
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
