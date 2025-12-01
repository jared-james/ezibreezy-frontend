// components/post-editor/panels/distribution-panel.tsx

"use client";

import { Send, Tag } from "lucide-react";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { Input } from "@/components/ui/input";

export default function DistributionPanel() {
  const labels = usePublishingStore((state) => state.labels);
  const setPublishingState = usePublishingStore(
    (state) => state.setPublishingState
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 pb-4">
        <h3 className="font-serif text-2xl font-bold">Distribution</h3>
        <Send className="w-5 h-5 text-[--muted-foreground]" />
      </div>

      <div className="mt-6 border border-[--border] bg-[--surface] p-6 rounded-lg shadow-sm">
        <div className="relative">
          <label htmlFor="labels" className="eyebrow mb-3 block">
            Labels
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="labels"
              value={labels}
              onChange={(event) =>
                setPublishingState({ labels: event.target.value })
              }
              placeholder="Promotion, News, Evergreen..."
              className="h-10 pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
