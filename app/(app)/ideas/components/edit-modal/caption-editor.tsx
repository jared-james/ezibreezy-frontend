// app/(app)/ideas/components/edit-modal/caption-editor.tsx

"use client";

import { Smile, Twitter, Instagram } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Platform } from "@/lib/types/editorial";

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
  mediaUploadSlot?: React.ReactNode;
}

const PlatformIcon = ({ platformId }: { platformId: string }) => {
  const Icon =
    platformId === "x"
      ? Twitter
      : platformId === "instagram"
      ? Instagram
      : null;

  if (!Icon) return null;

  return <Icon className="h-4 w-4 text-brand-primary" />;
};

export default function CaptionEditor({
  mainCaption,
  onMainCaptionChange,
  platformCaptions,
  onPlatformCaptionChange,
  selectedAccounts,
  platforms,
  onAccountSelect,
  postType,
  mediaUploadSlot,
}: CaptionEditorProps) {
  const mainPlaceholder =
    postType === "video"
      ? "Introduce the hook, context, and call to action for your video..."
      : postType === "image"
      ? "Describe the visual, context, and what you want people to feel..."
      : "Draft the main caption you want to adapt across platforms...";

  return (
    <>
      {mediaUploadSlot && <div className="mb-6">{mediaUploadSlot}</div>}

      <div>
        <label
          htmlFor="caption"
          className="eyebrow mb-2 flex items-center justify-between"
        >
          Main Caption
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
          >
            <Smile className="h-4 w-4" />
          </button>
        </label>
        <Textarea
          id="caption"
          rows={10}
          value={mainCaption}
          onChange={(event) => onMainCaptionChange(event.target.value)}
          placeholder={mainPlaceholder}
          className="min-h-32"
        />
      </div>

      {Object.keys(selectedAccounts).map((platformId) => {
        const platform = platforms.find((p) => p.id === platformId);
        if (!platform) return null;

        return (
          <div key={platformId} className="mt-6">
            <label
              htmlFor={`caption-${platformId}`}
              className="eyebrow mb-2 flex items-center gap-3"
            >
              <span className="flex items-center gap-2">
                <PlatformIcon platformId={platformId} />
                {platform.name} Caption
                {platform.accounts.length > 0 && (
                  <span className="ml-2 flex items-center gap-1.5">
                    {platform.accounts.map((account) => {
                      const isSelected = selectedAccounts[platformId]?.includes(
                        account.id
                      );

                      return (
                        <button
                          key={account.id}
                          type="button"
                          onClick={() =>
                            onAccountSelect(platformId, account.id)
                          }
                          className={cn(
                            "h-6 w-6 rounded-full border-2 transition-all",
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-border bg-surface hover:border-primary/50"
                          )}
                          title={account.name}
                        >
                          <span className="sr-only">{account.name}</span>
                        </button>
                      );
                    })}
                  </span>
                )}
              </span>
              <button
                type="button"
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <Smile className="h-4 w-4" />
              </button>
            </label>
            <Textarea
              id={`caption-${platformId}`}
              rows={10}
              value={platformCaptions[platformId] || ""}
              onChange={(event) =>
                onPlatformCaptionChange(platformId, event.target.value)
              }
              placeholder={`${platform.name} specific caption...`}
              className="min-h-32"
            />
          </div>
        );
      })}
    </>
  );
}
