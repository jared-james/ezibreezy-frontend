// components/post-editor/previews/instagram/instagram-options.tsx

"use client";

import CollaboratorSearchInput from "../../collaborator-search-input";
import LocationSearchInput from "../../location-search-input";
import { InstagramUserSearchResult } from "@/lib/api/integrations";

interface InstagramOptionsProps {
  integrationId: string | null;
  collaborators: InstagramUserSearchResult[];
  onCollaboratorsChange: (collaborators: InstagramUserSearchResult[]) => void;
  location: { id: string | null; name: string };
  onLocationChange: (location: { id: string; name: string } | null) => void;
  postType: string;
}

export function InstagramOptions({
  integrationId,
  collaborators,
  onCollaboratorsChange,
  location,
  onLocationChange,
  postType,
}: InstagramOptionsProps) {
  // Don't render for stories
  if (postType === "story") {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-bold text-foreground">
          Instagram Settings
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <CollaboratorSearchInput
            selectedCollaborators={collaborators}
            onCollaboratorsChange={onCollaboratorsChange}
            integrationId={integrationId}
          />
        </div>

        <div>
          <LocationSearchInput
            initialLocation={location}
            onLocationSelect={onLocationChange}
            integrationId={integrationId}
            isEnabled={true}
          />
        </div>
      </div>
    </div>
  );
}
