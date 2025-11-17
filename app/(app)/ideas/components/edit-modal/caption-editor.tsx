// app/(app)/ideas/components/edit-modal/caption-editor.tsx

"use client";

import { Smile } from "lucide-react";
import type { Platform } from "./channel-selector";

type SelectedAccounts = Record<string, string[]>;

interface CaptionEditorProps {
  mainCaption: string;
  onMainCaptionChange: (caption: string) => void;
  platformCaptions: Record<string, string>;
  onPlatformCaptionChange: (platformId: string, caption: string) => void;
  selectedAccounts: SelectedAccounts;
  platforms: Platform[];
  onAccountSelect: (platformId: string, accountId: string) => void;
  postType: "text" | "image" | "video";
}

export default function CaptionEditor({
  mainCaption,
  onMainCaptionChange,
  platformCaptions,
  onPlatformCaptionChange,
  selectedAccounts,
  platforms,
  onAccountSelect,
  postType,
}: CaptionEditorProps) {
  const textareaClasses =
    "w-full bg-white font-serif p-4 border border-border focus:border-foreground focus:ring-1 focus:ring-foreground transition-colors";

  return (
    <>
      <div>
        <label
          htmlFor="caption"
          className="eyebrow mb-2 flex items-center justify-between"
        >
          Main Caption
          <button type="button" className="text-muted hover:text-foreground">
            <Smile className="h-4 w-4" />
          </button>
        </label>
        <textarea
          id="caption"
          rows={10}
          value={mainCaption}
          onChange={(e) => onMainCaptionChange(e.target.value)}
          placeholder="Once upon a time..."
          className={textareaClasses}
        />
      </div>

      {Object.keys(selectedAccounts).map((platformId) => {
        const platform = platforms.find((p) => p.id === platformId);
        if (!platform) return null;

        return (
          <div key={platformId}>
            <label
              htmlFor={`caption-${platformId}`}
              className="eyebrow mb-2 flex items-center gap-3"
            >
              <span className="flex items-center gap-2">
                {platform.name} Caption
                {platform.accounts.length > 0 && (
                  <span className="ml-2 flex items-center gap-1.5">
                    {platform.accounts.map((acc) => {
                      const isSelected = selectedAccounts[platformId]?.includes(
                        acc.id
                      );
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => onAccountSelect(platformId, acc.id)}
                          className={`h-6 w-6 rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-border bg-white hover:border-primary/50"
                          }`}
                          title={acc.name}
                        >
                          <span className="sr-only">{acc.name}</span>
                        </button>
                      );
                    })}
                  </span>
                )}
              </span>
              <button
                type="button"
                className="ml-auto text-muted hover:text-foreground"
              >
                <Smile className="h-4 w-4" />
              </button>
            </label>
            <textarea
              id={`caption-${platformId}`}
              rows={10}
              value={platformCaptions[platformId] || ""}
              onChange={(e) =>
                onPlatformCaptionChange(platformId, e.target.value)
              }
              placeholder={`${platform.name} specific caption...`}
              className={textareaClasses}
            />
          </div>
        );
      })}
    </>
  );
}
