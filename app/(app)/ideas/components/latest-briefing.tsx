// app/(app)/ideas/components/latest-briefing.tsx

"use client";

import { useState } from "react";
import { RefreshCw, PenLine, BookmarkPlus, Lightbulb } from "lucide-react";
import EditClippingModal from "./edit-clipping-modal";
import type { Clipping as GeneratedClipping } from "@/lib/api/ideas";
import { Button } from "@/components/ui/button";

interface LatestBriefingProps {
  clippings: GeneratedClipping[];
}

export default function LatestBriefing({ clippings }: LatestBriefingProps) {
  const [selectedIdea, setSelectedIdea] = useState<GeneratedClipping | null>(
    null
  );

  if (clippings.length === 0) {
    return (
      <div className="pt-4">
        <h2 className="mb-6 border-b border-border pb-3 font-serif text-2xl font-bold text-foreground">
          Latest Briefing
        </h2>
        <div className="rounded-lg border-2 border-dashed border-border bg-surface py-12 text-center">
          <Lightbulb className="mb-3 h-12 w-12 mx-auto text-muted-foreground" />
          <h4 className="mb-2 font-serif text-lg font-medium text-foreground">
            Your generated ideas will appear here
          </h4>
          <p className="font-serif text-sm text-foreground/60">
            Write a memo above to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-4">
        <h2 className="mb-6 border-b border-border pb-3 font-serif text-2xl font-bold text-foreground">
          Latest Briefing
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {clippings.map((idea, index) => (
            <div
              key={index}
              className="flex flex-col justify-between border border-border bg-card p-5"
            >
              <div>
                <h3 className="mb-2 font-serif text-xl font-bold text-foreground">
                  {idea.title}
                </h3>
                <p className="mb-4 font-serif text-sm leading-relaxed text-foreground/80">
                  {idea.body}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-dashed border-border pt-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    title="Remix with AI"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    title="Refine Manually"
                    onClick={() => setSelectedIdea(idea)}
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="gap-2"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  <span>Save Clipping</span>
                </Button>
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
