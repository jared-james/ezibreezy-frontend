"use client";

import { useState, useEffect } from "react";
import { Send, Tag } from "lucide-react";
import { useEditorialStore } from "@/lib/store/editorial-store";
import { Input } from "@/components/ui/input";

interface DistributionPanelProps {
  onLabelsChange?: (labels: string) => void;
}

export default function DistributionPanel({
  onLabelsChange,
}: DistributionPanelProps) {
  const labels = useEditorialStore((state) => state.labels);
  const [localLabels, setLocalLabels] = useState(labels);

  useEffect(() => {
    setLocalLabels(labels);
  }, [labels]);

  useEffect(() => {
    if (onLabelsChange) {
      onLabelsChange(localLabels);
    }
  }, [localLabels, onLabelsChange]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
        <h3 className="font-serif text-xl font-bold text-[--foreground]">
          Distribution
        </h3>
        <Send className="h-4 w-4 text-[--muted]" />
      </div>

      <div className="mt-4 border border-border p-5">
        <div className="relative">
          <label htmlFor="labels" className="eyebrow">
            Labels
          </label>
          <div className="relative mt-2">
            <Tag className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="labels"
              value={localLabels}
              onChange={(event) => setLocalLabels(event.target.value)}
              placeholder="Promotion, News, Evergreen..."
              className="h-9 pl-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
