// app/(app)/ideas/components/edit-modal/hashtag-selector-modal.tsx

"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { X, Hash, Search, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HashtagSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Hashtags as a space-separated string of #tag1 #tag2 */
  initialHashtags: string;
  onSave: (hashtagsString: string) => void;
}

const MOCK_TAGS = [
  "marketing",
  "saas",
  "growth",
  "startups",
  "b2b",
  "ai",
  "futureofwork",
  "product",
  "editorial",
  "socialmedia",
  "contentcreation",
  "business",
  "design",
  "tech",
  "leadership",
  "devlife",
  "nocode",
  "fintech",
  "healthtech",
  "remotework",
];

const parseHashtagString = (tagString: string): string[] => {
  if (!tagString) return [];
  return tagString
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
    .filter((t) => t.length > 0);
};

const formatHashtagsToString = (tags: string[]): string =>
  tags.map((t) => `#${t}`).join(" ");

export default function HashtagSelectorModal({
  isOpen,
  onClose,
  initialHashtags,
  onSave,
}: HashtagSelectorModalProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedTags(parseHashtagString(initialHashtags));
      setSearchText("");
      setCustomTagInput("");
    }
  }, [isOpen, initialHashtags]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const isSelected = prev.includes(tag);
      if (isSelected) {
        return prev.filter((t) => t !== tag);
      }
      return Array.from(new Set([...prev, tag])).sort();
    });
  }, []);

  const addCustomTag = (tag: string) => {
    const cleanTag = tag.trim().toLowerCase().replace(/^#/, "");
    if (cleanTag.length > 0) {
      toggleTag(cleanTag);
      setCustomTagInput("");
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addCustomTag(customTagInput);
    }
  };

  const handleSave = () => {
    onSave(formatHashtagsToString(selectedTags));
    onClose();
  };

  const filteredTags = useMemo(() => {
    const allUniqueTags = Array.from(new Set([...MOCK_TAGS, ...selectedTags]));
    if (!searchText) return allUniqueTags.sort();

    const searchLower = searchText.toLowerCase();
    return allUniqueTags.filter((tag) => tag.includes(searchLower)).sort();
  }, [searchText, selectedTags]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border-4 border-foreground w-full max-w-2xl shadow-2xl p-6 relative flex flex-col h-[80vh]">
        <div className="flex justify-between items-center border-b-2 border-foreground pb-4 mb-4 shrink-0">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Select Hashtags
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-4 mb-4 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search or filter tags..."
              className="pl-10"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Add custom tag (e.g. #myidea)"
              className="pl-10"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={handleCustomKeyDown}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <p className="eyebrow mb-3 text-sm">Suggested Tags</p>
          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 font-serif text-sm rounded-full border transition-colors",
                    isSelected
                      ? "bg-brand-primary text-brand-primary-foreground border-brand-primary"
                      : "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary-foreground hover:text-secondary"
                  )}
                >
                  <Hash className="w-3 h-3" />
                  <span>{tag}</span>
                  {isSelected && <CheckCircle className="w-3 h-3 ml-1" />}
                </button>
              );
            })}
            {filteredTags.length === 0 && (
              <p className="font-serif text-sm text-muted-foreground italic">
                No tags found matching "{searchText}"
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 border-t-2 border-dashed border-border pt-4 shrink-0">
          <p className="eyebrow mb-2">Selected ({selectedTags.length})</p>
          <div className="flex flex-wrap gap-2 min-h-8 mb-4 border border-border p-2 bg-surface-hover">
            {selectedTags.length > 0 ? (
              selectedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 font-serif text-xs text-brand-primary-foreground transition-opacity hover:opacity-80"
                >
                  <span className="font-medium">#{tag}</span>
                  <X className="h-3 w-3" />
                </button>
              ))
            ) : (
              <p className="font-serif text-sm text-muted-foreground italic">
                No hashtags selected.
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} variant="primary" className="w-48">
              Save & Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
