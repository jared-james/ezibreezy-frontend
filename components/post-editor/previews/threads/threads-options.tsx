// components/post-editor/previews/threads/threads-options.tsx

"use client";

import { Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import LocationSearchInput from "../../location-search-input";

interface ThreadsOptionsProps {
  integrationId: string | null;
  topicTag: string;
  onTopicTagChange: (tag: string) => void;
  linkAttachment: string;
  onLinkAttachmentChange: (url: string) => void;
  hasMedia: boolean;
  location: { id: string | null; name: string };
  onLocationChange: (location: { id: string; name: string } | null) => void;
}

export function ThreadsOptions({
  integrationId,
  topicTag,
  onTopicTagChange,
  linkAttachment,
  onLinkAttachmentChange,
  hasMedia,
  location,
  onLocationChange,
}: ThreadsOptionsProps) {
  const handleTopicTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Strip out . and & characters
    value = value.replace(/[.&]/g, "");
    onTopicTagChange(value);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-bold text-foreground">
          Threads Settings
        </h3>
      </div>

      <div className="space-y-4">
        {/* Topic Tag */}
        <div>
          <label
            htmlFor="topic-tag"
            className="eyebrow mb-2 flex items-center"
          >
            Topic Tag
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              #
            </span>
            <Input
              id="topic-tag"
              value={topicTag}
              onChange={handleTopicTagChange}
              placeholder="Topic (max 50 chars)"
              className="h-9 pl-7"
              maxLength={50}
            />
          </div>
        </div>

        {/* Link Attachment - Only shown when no media */}
        {!hasMedia && (
          <div>
            <label
              htmlFor="link-attachment"
              className="eyebrow mb-2 flex items-center"
            >
              <LinkIcon className="mr-1.5 h-3 w-3" />
              Link Attachment
            </label>
            <Input
              id="link-attachment"
              type="url"
              value={linkAttachment}
              onChange={(e) => onLinkAttachmentChange(e.target.value)}
              placeholder="https://example.com"
              className="h-9"
            />
          </div>
        )}

        {/* Location */}
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
