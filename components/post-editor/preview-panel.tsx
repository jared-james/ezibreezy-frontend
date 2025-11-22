// components/post-editor/preview-panel.tsx

"use client";

import { useState, useMemo, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Twitter, Instagram, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { getConnections } from "@/lib/api/integrations";
import XPreview from "./x-preview";
import InstagramPreview from "./instagram-preview";
import { cn } from "@/lib/utils";
import { usePostEditor } from "@/lib/hooks/use-post-editor";

const platformIcons = {
  x: Twitter,
  instagram: Instagram,
};

const platformNames = {
  x: "X",
  instagram: "Instagram",
};

interface PreviewPanelProps {
  selectedAccounts: Record<string, string[]>;
  mainCaption: string;
  platformCaptions: Record<string, string>;
  collaborators: string;
  location: string;
}

function PreviewPanel({
  selectedAccounts,
  mainCaption,
  platformCaptions,
  collaborators,
  location,
}: PreviewPanelProps) {
  const { postType, mainPostMediaPreviews, threadMessages } = usePostEditor();

  const { data: connections = [] } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const activePlatforms = useMemo(
    () => Object.keys(selectedAccounts),
    [selectedAccounts]
  );

  const [activeTab, setActiveTab] = useState<string>("empty");

  // Compute the valid active tab (either the current selection if valid, or default)
  const validActiveTab = useMemo(() => {
    if (activePlatforms.length === 0) return "empty";
    if (activeTab !== "empty" && activePlatforms.includes(activeTab)) {
      return activeTab;
    }
    return activePlatforms[0];
  }, [activePlatforms, activeTab]);

  const activeAccount = useMemo(() => {
    if (validActiveTab === "empty") return null;

    const integrationId = selectedAccounts[validActiveTab]?.[0];
    if (!integrationId) return null;

    return connections.find((conn) => conn.id === integrationId) || null;
  }, [validActiveTab, selectedAccounts, connections]);

  const tabList = useMemo(
    () =>
      activePlatforms.map((id) => {
        const Icon = platformIcons[id as keyof typeof platformIcons] || Twitter;
        return {
          id,
          name: platformNames[id as keyof typeof platformNames] || id,
          Icon,
        };
      }),
    [activePlatforms]
  );

  const currentCaption = useMemo(
    () => platformCaptions[validActiveTab] || mainCaption,
    [platformCaptions, validActiveTab, mainCaption]
  );

  if (activePlatforms.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
          <h3 className="font-serif text-xl font-bold text-[--foreground]">
            Post Preview
          </h3>
          <LayoutGrid className="w-4 h-4 text-[--muted]" />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-[--border] bg-[--surface] text-center p-8 mt-4">
          <Image
            src="/select_a_channel.webp"
            alt="Select a channel"
            width={160}
            height={160}
            className="mb-3"
          />
          <h3 className="font-serif text-lg font-bold">Select a Channel</h3>
          <p className="font-serif text-sm text-[--muted-foreground] max-w-xs mt-2">
            Select an account on the left to see a live preview of your post
            here.
          </p>
        </div>
      </div>
    );
  }

  const renderPreview = () => {
    if (!activeAccount) {
      return (
        <div className="text-center p-8 text-[--muted-foreground]">
          No account selected for preview.
        </div>
      );
    }

    switch (validActiveTab) {
      case "x":
        return (
          <XPreview
            caption={currentCaption}
            mediaPreview={mainPostMediaPreviews}
            threadMessages={threadMessages}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            postType={postType}
          />
        );
      case "instagram": {
        const singleMedia = Array.isArray(mainPostMediaPreviews)
          ? mainPostMediaPreviews[0]
          : mainPostMediaPreviews;

        return (
          <InstagramPreview
            caption={currentCaption}
            mediaPreview={singleMedia}
            platformUsername={activeAccount.platformUsername}
            displayName={activeAccount.name}
            avatarUrl={activeAccount.avatarUrl}
            collaborators={collaborators}
            location={location}
          />
        );
      }
      default:
        return (
          <div className="text-center p-8 text-[--muted-foreground]">
            No preview available for {validActiveTab}.
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
        <h3 className="font-serif text-xl font-bold text-[--foreground]">
          Post Preview
        </h3>
        <LayoutGrid className="w-4 h-4 text-[--muted]" />
      </div>

      <div className="bg-[--surface] border border-[--border] mt-4">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[--border] bg-[--background]">
          {tabList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-serif transition-colors",
                validActiveTab === tab.id
                  ? "bg-[--foreground] text-[--background] font-bold"
                  : "text-[--muted] hover:bg-[--surface-hover]"
              )}
            >
              <tab.Icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-[--background] min-h-[400px]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}

export default memo(PreviewPanel);
