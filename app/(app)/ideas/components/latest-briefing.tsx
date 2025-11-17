// app/(app)/ideas/components/latest-briefing.tsx

"use client";

import { useState } from "react";
import { RefreshCw, PenLine, BookmarkPlus, Lightbulb } from "lucide-react";
import EditClippingModal from "./edit-clipping-modal";
import type { Clipping } from "@/lib/api/ideas"; // CORRECTED IMPORT

interface LatestBriefingProps {
  clippings: Clipping[];
}

export default function LatestBriefing({ clippings }: LatestBriefingProps) {
  const [selectedIdea, setSelectedIdea] = useState<Clipping | null>(null);

  if (clippings.length === 0) {
    return (
      <div className="pt-4">
        <h2 className="font-serif text-2xl font-bold text-[--foreground] border-b-2 border-[--foreground] pb-3 mb-6">
          Latest Briefing
        </h2>
        <div className="text-center py-12 border-2 border-dashed border-[--border] rounded-lg">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 text-[--muted-foreground]" />
          <h4 className="font-serif text-lg font-medium text-[--foreground] mb-2">
            Your generated ideas will appear here
          </h4>
          <p className="font-serif text-sm text-[--muted]">
            Write a memo above to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-4">
        <h2 className="font-serif text-2xl font-bold text-[--foreground] border-b-2 border-[--foreground] pb-3 mb-6">
          Latest Briefing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clippings.map((idea, index) => (
            <div
              key={index}
              className="bg-[--card] border border-[--border] p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif text-xl font-bold text-[--foreground] mb-2">
                  {idea.title}
                </h3>
                <p className="font-serif text-sm text-[--muted] leading-relaxed mb-4">
                  {idea.body}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-[--border]">
                <div className="flex items-center gap-2">
                  <button title="Remix with AI" className="btn btn-sm btn-icon">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    title="Refine Manually"
                    onClick={() => setSelectedIdea(idea)}
                    className="btn btn-sm btn-icon"
                  >
                    <PenLine className="w-4 h-4" />
                  </button>
                </div>
                <button className="btn btn-sm">
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Save Clipping</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedIdea && (
        <EditClippingModal
          isOpen={!!selectedIdea}
          onClose={() => setSelectedIdea(null)}
          idea={selectedIdea}
        />
      )}
    </>
  );
}
