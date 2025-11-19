// app/(app)/ideas/components/edit-modal/distribution-panel.tsx

"use client";

import { useMemo } from "react";
import {
  Send,
  Tag,
  Hash,
  AtSign,
  MapPin,
  BookmarkPlus,
  Edit3,
  X,
  Twitter,
  Instagram,
} from "lucide-react";
import { useEditorialStore } from "@/lib/store/editorial-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTagInput } from "@/lib/hooks/use-tag-input";

interface DistributionPanelProps {
  onOpenInEditorial?: () => void;
  onSaveClipping?: () => void;
  showActionButtons?: boolean;
}

interface PlatformIconDisplayProps {
  platformId: string;
  isActive: boolean;
}

const PlatformIconDisplay = ({
  platformId,
  isActive,
}: PlatformIconDisplayProps) => {
  const Icon =
    platformId === "x"
      ? Twitter
      : platformId === "instagram"
      ? Instagram
      : null;

  if (!Icon) return null;

  return (
    <div
      className={cn(
        "flex size-4 items-center justify-center rounded-sm transition-opacity",
        isActive ? "text-brand-primary" : "text-muted-foreground opacity-50"
      )}
      title={platformId === "x" ? "Shows on X/Twitter" : "Shows on Instagram"}
    >
      <Icon className="size-3.5" />
    </div>
  );
};

export default function DistributionPanel({
  onOpenInEditorial,
  onSaveClipping,
  showActionButtons = true,
}: DistributionPanelProps) {
  const labels = useEditorialStore((state) => state.labels);
  const hashtags = useEditorialStore((state) => state.hashtags);
  const collaborators = useEditorialStore((state) => state.collaborators);
  const location = useEditorialStore((state) => state.location);
  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const setState = useEditorialStore((state) => state.setState);

  const activePlatforms = useMemo(
    () => new Set(Object.keys(selectedAccounts)),
    [selectedAccounts]
  );

  const onLabelsChange = (value: string) => setState({ labels: value });
  const onHashtagsChange = (value: string) => setState({ hashtags: value });
  const onCollaboratorsChange = (value: string) =>
    setState({ collaborators: value });
  const onLocationChange = (value: string) => setState({ location: value });

  const {
    tagChips,
    currentTagInput,
    handleInputChange,
    handleKeyDown,
    removeTag,
    inputPlaceholder,
  } = useTagInput({
    initialHashtags: hashtags,
    onHashtagsChange: onHashtagsChange,
  });

  const fieldSupport = useMemo(
    () => ({
      hashtags: ["x", "instagram"],
      collaborators: ["instagram"],
      location: ["instagram"],
    }),
    []
  );

  const shouldShowField = (field: keyof typeof fieldSupport) =>
    fieldSupport[field].some((id) => activePlatforms.has(id));

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
        <h3 className="font-serif text-xl font-bold text-[--foreground]">
          Distribution
        </h3>
        <Send className="h-4 w-4 text-[--muted]" />
      </div>

      <div className="mt-4 space-y-6 border border-border  p-5">
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="labels" className="eyebrow">
              Labels
            </label>
            <div className="relative mt-2">
              <Tag className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="labels"
                value={labels}
                onChange={(event) => onLabelsChange(event.target.value)}
                placeholder="Promotion, News, Evergreen..."
                className="h-9 pl-8"
              />
            </div>
          </div>

          {shouldShowField("hashtags") && (
            <div className="relative animate-in fade-in-50">
              <label
                htmlFor="hashtags"
                className="eyebrow flex items-center gap-2"
              >
                Hashtags
                {fieldSupport.hashtags.map((id) => (
                  <PlatformIconDisplay
                    key={id}
                    platformId={id}
                    isActive={activePlatforms.has(id)}
                  />
                ))}
              </label>
              <div
                className={cn(
                  "mt-2 flex min-h-9 flex-wrap gap-2 rounded-sm border border-border bg-surface p-2 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40",
                  tagChips.length > 0 ? "items-start" : "items-center"
                )}
              >
                <Hash className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground transition-all duration-100" />

                {tagChips.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-serif text-xs text-secondary-foreground"
                  >
                    <span className="font-medium">#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                <Input
                  id="hashtags"
                  value={currentTagInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={inputPlaceholder}
                  className={cn(
                    "m-0 h-auto flex-1 border-none bg-transparent p-0 shadow-none focus-visible:border-none focus-visible:ring-0",
                    tagChips.length === 0 ? "pl-8" : "pl-1"
                  )}
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          {shouldShowField("collaborators") && (
            <div className="relative animate-in fade-in-50">
              <label
                htmlFor="collaborators"
                className="eyebrow flex items-center gap-2"
              >
                Collaborators
                {fieldSupport.collaborators.map((id) => (
                  <PlatformIconDisplay
                    key={id}
                    platformId={id}
                    isActive={activePlatforms.has(id)}
                  />
                ))}
              </label>
              <div className="relative mt-2">
                <AtSign className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="collaborators"
                  value={collaborators}
                  onChange={(event) =>
                    onCollaboratorsChange(event.target.value)
                  }
                  placeholder="@username"
                  className="h-9 pl-8"
                />
              </div>
            </div>
          )}

          {shouldShowField("location") && (
            <div className="relative animate-in fade-in-50">
              <label
                htmlFor="location"
                className="eyebrow flex items-center gap-2"
              >
                Location
                {fieldSupport.location.map((id) => (
                  <PlatformIconDisplay
                    key={id}
                    platformId={id}
                    isActive={activePlatforms.has(id)}
                  />
                ))}
              </label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  value={location}
                  onChange={(event) => onLocationChange(event.target.value)}
                  placeholder="New York, NY"
                  className="h-9 pl-8"
                />
              </div>
            </div>
          )}
        </div>

        {showActionButtons && (
          <div className="space-y-3 pt-4">
            <Button onClick={onSaveClipping} className="w-full gap-2">
              <BookmarkPlus className="h-4 w-4" />
              Save Clipping
            </Button>
            <Button
              onClick={onOpenInEditorial}
              variant="outline"
              className="w-full gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Open in Editorial
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
