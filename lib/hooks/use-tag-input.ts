// lib/hooks/use-tag-input.ts

import { useState, useEffect, useCallback } from "react";
import type React from "react";

/**
 * Parses a hashtag string into an array of clean tag strings.
 */
const parseTags = (tagString: string | undefined): string[] => {
  if (!tagString) return [];
  return tagString
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
    .filter((t) => t.length > 0);
};

interface UseTagInputProps {
  initialHashtags: string;
  onHashtagsChange: (value: string) => void;
}

export function useTagInput({
  initialHashtags,
  onHashtagsChange,
}: UseTagInputProps) {
  const [tagChips, setTagChips] = useState<string[]>(
    parseTags(initialHashtags)
  );
  const [currentTagInput, setCurrentTagInput] = useState("");

  useEffect(() => {
    const currentChipsString = tagChips.map((t) => `#${t}`).join(" ");
    if (
      initialHashtags !== currentChipsString &&
      currentTagInput.length === 0
    ) {
      setTagChips(parseTags(initialHashtags));
    }
  }, [initialHashtags, tagChips, currentTagInput]);

  const formatChipsToString = useCallback(
    (chips: string[]) => chips.map((t) => `#${t}`).join(" "),
    []
  );

  const addTag = useCallback(
    (input: string) => {
      const newTag = input.trim().toLowerCase().replace(/^#/, "");
      if (newTag.length > 0) {
        setTagChips((prev) => {
          const newChips = Array.from(new Set([...prev, newTag]));
          onHashtagsChange(formatChipsToString(newChips));
          return newChips;
        });
        setCurrentTagInput("");
      }
    },
    [onHashtagsChange, formatChipsToString]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      setTagChips((prev) => {
        const newChips = prev.filter((tag) => tag !== tagToRemove);
        onHashtagsChange(formatChipsToString(newChips));
        return newChips;
      });
    },
    [onHashtagsChange, formatChipsToString]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === " " || e.key === "," || e.key === "Enter") {
        e.preventDefault();
        addTag(currentTagInput);
      } else if (
        e.key === "Backspace" &&
        currentTagInput.length === 0 &&
        tagChips.length > 0
      ) {
        removeTag(tagChips[tagChips.length - 1]);
      }
    },
    [addTag, currentTagInput, tagChips, removeTag]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.includes(",")) {
        const parts = value.split(",");
        parts.slice(0, -1).forEach(addTag);
        setCurrentTagInput(parts.pop() || "");
      } else {
        setCurrentTagInput(value);
      }
    },
    [addTag]
  );

  return {
    tagChips,
    currentTagInput,
    handleInputChange,
    handleKeyDown,
    removeTag,
    inputPlaceholder: tagChips.length === 0 ? "marketing, saas, growth" : "",
  };
}
