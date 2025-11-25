// components/post-editor/hashtag-selector-modal.tsx

"use client";

import { useState, useCallback, useEffect } from "react";
import { X, Hash, CheckCircle, Library, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getClientDataForEditor } from "@/app/actions/data";
import { listHashtagGroups } from "@/lib/api/hashtags";

interface HashtagSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHashtags: string;
  onSave: (hashtagsString: string) => void;
}

const parseHashtagString = (tagString: string): string[] => {
  if (!tagString) return [];
  // Match words that start with #, allowing alphanumeric, underscores, and hyphens
  const hashtagRegex = /#([\w-]+)/g;
  const matches = tagString.match(hashtagRegex);
  if (!matches) return [];
  return matches.map((tag) => tag.replace(/^#/, "").toLowerCase());
};

const formatHashtagsToString = (tags: string[]): string =>
  tags.map((t) => `#${t}`).join(" ");

export default function HashtagSelectorModal({
  isOpen,
  onClose,
  initialHashtags,
  onSave,
}: HashtagSelectorModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  // Fetch user context to get organizationId
  const { data: clientData } = useQuery({
    queryKey: ["clientEditorData"],
    queryFn: getClientDataForEditor,
    staleTime: 60000,
  });

  const organizationId = clientData?.organizationId;

  // Fetch hashtag groups from library
  const { data: hashtagGroups = [] } = useQuery({
    queryKey: ["hashtag-groups", organizationId],
    queryFn: () => listHashtagGroups(organizationId!),
    enabled: !!organizationId && isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedTags(parseHashtagString(initialHashtags));
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

  const handleSave = () => {
    // Get existing hashtags from the caption
    const existingHashtags = parseHashtagString(initialHashtags);

    // Only add new hashtags that aren't already in the caption
    const newHashtags = selectedTags.filter(
      (tag) => !existingHashtags.includes(tag)
    );

    // Only save if there are new hashtags to add
    if (newHashtags.length > 0) {
      onSave(formatHashtagsToString(newHashtags));
    }

    onClose();
  };

  const handleToggleGroup = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  const getHashtagsFromGroup = (content: string): string[] => {
    return content
      .split(/\s+/)
      .map((tag) => tag.trim().replace(/^#/, "").toLowerCase())
      .filter((tag) => tag.length > 0);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border-4 border-foreground w-full max-w-2xl shadow-2xl p-6 relative flex flex-col h-[80vh]">
        <div className="flex justify-between items-center border-b-2 border-foreground pb-4 mb-4 shrink-0">
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Hashtag Library
            </h2>
            <p className="font-serif text-sm text-muted-foreground italic mt-1">
              Select hashtags to add to your post
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          <p className="eyebrow mb-3 text-sm">
            Saved Hashtag Groups ({hashtagGroups.length})
          </p>
          {hashtagGroups.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border">
              <Library className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="font-serif text-sm text-muted-foreground mb-2">
                No saved hashtag groups yet
              </p>
              <p className="font-serif text-xs text-muted-foreground italic">
                Create groups in Assets → Hashtags
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {hashtagGroups.map((group) => {
                const isExpanded = expandedGroupId === group.id;
                const groupHashtags = getHashtagsFromGroup(group.content);

                return (
                  <div key={group.id} className="border border-border">
                    <button
                      type="button"
                      onClick={() => handleToggleGroup(group.id)}
                      className="w-full text-left p-3 hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-sm">
                            {group.name}
                          </h3>
                          <p className="font-mono text-xs text-muted-foreground mt-1">
                            {groupHashtags.length} hashtag
                            {groupHashtags.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="shrink-0 ml-2">
                          {isExpanded ? (
                            <X className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-3 pt-0 border-t border-border bg-surface-hover">
                        <div className="flex flex-wrap gap-2 mt-2">
                          {groupHashtags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                  "flex items-center gap-1 px-3 py-1 font-mono text-xs rounded-full border transition-colors",
                                  isSelected
                                    ? "bg-brand-primary text-brand-primary-foreground border-brand-primary"
                                    : "bg-surface text-foreground border-border hover:border-brand-primary"
                                )}
                              >
                                <Hash className="w-3 h-3" />
                                <span>{tag}</span>
                                {isSelected && (
                                  <CheckCircle className="w-3 h-3 ml-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
                  className="flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 font-mono text-xs text-brand-primary-foreground transition-opacity hover:opacity-80"
                >
                  <span>#{tag}</span>
                  <X className="h-3 w-3" />
                </button>
              ))
            ) : (
              <p className="font-serif text-sm text-muted-foreground italic">
                No hashtags selected.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="primary">
              Add Selected Hashtags
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
