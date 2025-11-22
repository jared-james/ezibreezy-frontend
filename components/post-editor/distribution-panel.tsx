// components/post-editor/distribution-panel.tsx

"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Send,
  Tag,
  AtSign,
  MapPin,
  BookmarkPlus,
  Edit3,
  Twitter,
  Instagram,
  Loader2,
} from "lucide-react";
import { useEditorialStore } from "@/lib/store/editorial-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DistributionPanelProps {
  onOpenInEditorial?: () => void;
  onSaveClipping?: () => void;
  showActionButtons?: boolean;
  isSaving?: boolean;
  onLocalFieldsChange?: (
    labels: string,
    collaborators: string,
    location: string
  ) => void;
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
  isSaving = false,
  onLocalFieldsChange,
}: DistributionPanelProps) {
  const labels = useEditorialStore((state) => state.labels);
  const collaborators = useEditorialStore((state) => state.collaborators);
  const location = useEditorialStore((state) => state.location);
  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);

  const [localLabels, setLocalLabels] = useState(labels);
  const [localCollaborators, setLocalCollaborators] = useState(collaborators);
  const [localLocation, setLocalLocation] = useState(location);

  useEffect(() => {
    setLocalLabels(labels);
  }, [labels]);

  useEffect(() => {
    setLocalCollaborators(collaborators);
  }, [collaborators]);

  useEffect(() => {
    setLocalLocation(location);
  }, [location]);

  useEffect(() => {
    if (onLocalFieldsChange) {
      onLocalFieldsChange(localLabels, localCollaborators, localLocation);
    }
  }, [localLabels, localCollaborators, localLocation, onLocalFieldsChange]);

  const activePlatforms = useMemo(
    () => new Set(Object.keys(selectedAccounts)),
    [selectedAccounts]
  );

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

      <div className="mt-4 space-y-6 border border-border p-5">
        <div className="space-y-4">
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
                  value={localCollaborators}
                  onChange={(event) =>
                    setLocalCollaborators(event.target.value)
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
                  value={localLocation}
                  onChange={(event) => setLocalLocation(event.target.value)}
                  placeholder="New York, NY"
                  className="h-9 pl-8"
                />
              </div>
            </div>
          )}
        </div>

        {showActionButtons && (
          <div className="space-y-3 pt-4">
            <Button
              onClick={onSaveClipping}
              className="w-full gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BookmarkPlus className="h-4 w-4" />
              )}
              <span>Save Clipping</span>
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
