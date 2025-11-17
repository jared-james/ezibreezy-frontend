// app/(app)/editorial/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckSquare,
  Lightbulb,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Video,
  Calendar,
} from "lucide-react";
import { useEditorialStore } from "@/lib/store/editorial-store";
import PostTypeSelector from "../ideas/components/edit-modal/post-type-selector";
import ChannelSelector, {
  type Platform,
} from "../ideas/components/edit-modal/channel-selector";
import CaptionEditor from "../ideas/components/edit-modal/caption-editor";
import MediaPanel from "../ideas/components/edit-modal/media-panel";
import DistributionPanel from "../ideas/components/edit-modal/distribution-panel";

// Platform data with icons
const platforms: Platform[] = [
  {
    id: "twitter",
    name: "Twitter/X",
    icon: Twitter,
    accounts: [
      { id: "tw1", name: "@thebreezyco", img: "/placeholder-pfp.png" },
      { id: "tw2", name: "@personal", img: "/placeholder-pfp.png" },
      { id: "tw3", name: "@sidehustle", img: "/placeholder-pfp.png" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    accounts: [
      { id: "ig1", name: "breezy_times", img: "/placeholder-pfp.png" },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    accounts: [{ id: "li1", name: "John Doe", img: "/placeholder-pfp.png" }],
  },
  { id: "facebook", name: "Facebook", icon: Facebook, accounts: [] },
  { id: "tiktok", name: "TikTok", icon: Video, accounts: [] },
  { id: "youtube", name: "YouTube", icon: Youtube, accounts: [] },
];

type SelectedAccounts = Record<string, string[]>;

export default function EditorialPage() {
  const [postType, setPostType] = useState<"text" | "image" | "video">("text");
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<SelectedAccounts>({
    twitter: ["tw1"],
  });
  const [mainCaption, setMainCaption] = useState("");
  const [platformCaptions, setPlatformCaptions] = useState<
    Record<string, string>
  >({});
  const [activePlatforms, setActivePlatforms] = useState<Set<string>>(
    new Set(["twitter"])
  );
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [labels, setLabels] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [firstComment, setFirstComment] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [location, setLocation] = useState("");

  const { draft, clearDraft } = useEditorialStore();

  // Load draft data from store on mount
  useEffect(() => {
    if (draft) {
      // Populate all fields from the draft
      setPostType(draft.postType);
      setMainCaption(draft.mainCaption);
      setPlatformCaptions(draft.platformCaptions);
      setActivePlatforms(new Set(draft.activePlatforms));
      setSelectedAccounts(draft.selectedAccounts);

      // Load media if present
      if (draft.media) {
        setMediaFile(draft.media.file);
        setMediaPreview(draft.media.preview);
      }

      // Load distribution data if present
      if (draft.distribution) {
        setLabels(draft.distribution.labels || "");
        setHashtags(draft.distribution.hashtags || "");
        setFirstComment(draft.distribution.firstComment || "");
        setCollaborators(draft.distribution.collaborators || "");
        setLocation(draft.distribution.location || "");
      }

      // Load schedule if present
      if (draft.schedule) {
        setIsScheduling(draft.schedule.isScheduled);
      }

      // Clear the draft after loading
      clearDraft();
    }
  }, [draft, clearDraft]);

  const togglePlatform = (platformId: string) => {
    const isCurrentlyActive = activePlatforms.has(platformId);

    if (isCurrentlyActive) {
      setActivePlatforms((prev) => {
        const newSet = new Set(prev);
        newSet.delete(platformId);
        return newSet;
      });
      setSelectedAccounts((prev) => {
        const { [platformId]: _, ...rest } = prev;
        return rest;
      });
      setPlatformCaptions((prev) => {
        const { [platformId]: _, ...rest } = prev;
        return rest;
      });
    } else {
      const platform = platforms.find((p) => p.id === platformId);
      if (!platform) return;

      setActivePlatforms((prev) => new Set(prev).add(platformId));

      if (platform.accounts.length > 0) {
        setSelectedAccounts((prev) => ({
          ...prev,
          [platformId]: [platform.accounts[0].id],
        }));
        setPlatformCaptions((prev) => ({
          ...prev,
          [platformId]: mainCaption,
        }));
      }
    }
  };

  const handleAccountSelect = (platformId: string, accountId: string) => {
    setSelectedAccounts((prev) => {
      const currentSelection = prev[platformId] || [];
      const isSelected = currentSelection.includes(accountId);

      const newSelection = isSelected
        ? currentSelection.filter((id) => id !== accountId)
        : [...currentSelection, accountId];

      if (newSelection.length === 0) {
        const { [platformId]: _, ...rest } = prev;
        setPlatformCaptions((prevCaptions) => {
          const { [platformId]: __, ...restCaptions } = prevCaptions;
          return restCaptions;
        });
        return rest;
      }

      if (currentSelection.length === 0 && newSelection.length === 1) {
        setPlatformCaptions((prevCaptions) => ({
          ...prevCaptions,
          [platformId]: mainCaption,
        }));
      }

      return { ...prev, [platformId]: newSelection };
    });
  };

  const handleMediaChange = (file: File | null, preview: string | null) => {
    setMediaFile(file);
    setMediaPreview(preview);
  };

  return (
    <>
      <div className="h-full flex flex-col w-full max-w-7xl mx-auto p-4 md:p-6 ">
        {/* --- MASTHEAD SECTION --- */}
        <div className="mb-8 border-b-4 border-double border-[--foreground] pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">The Workroom</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-[--foreground]">
                Editorial Desk
              </h1>
              <p className="font-serif text-[--muted] mt-2 max-w-xl text-lg italic">
                Where the stories are forged and finalized for publication.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-[--muted-foreground] font-serif">
                Vol. 1 · Issue 42
              </p>
            </div>
          </div>
        </div>

        {/* --- MAIN WORKSPACE GRID --- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          {/* --- COLUMN 1: DRAFTING --- */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
              <h2 className="font-serif text-xl font-bold text-[--foreground]">
                The Draft
              </h2>
              <FileText className="w-4 h-4 text-[--muted]" />
            </div>

            <div className="space-y-6">
              <div>
                <button className="btn w-full justify-start gap-3 border-[--border] hover:border-[--foreground] transition-colors">
                  <Lightbulb className="w-4 h-4 text-[--brand-accent]" />
                  <span className="font-serif">Select an existing idea...</span>
                </button>
              </div>

              <PostTypeSelector
                postType={postType}
                onPostTypeChange={setPostType}
              />

              <ChannelSelector
                platforms={platforms}
                activePlatforms={activePlatforms}
                onTogglePlatform={togglePlatform}
              />

              <CaptionEditor
                mainCaption={mainCaption}
                onMainCaptionChange={setMainCaption}
                platformCaptions={platformCaptions}
                onPlatformCaptionChange={(platformId, caption) =>
                  setPlatformCaptions((prev) => ({
                    ...prev,
                    [platformId]: caption,
                  }))
                }
                selectedAccounts={selectedAccounts}
                platforms={platforms}
                onAccountSelect={handleAccountSelect}
                postType={postType}
              />
            </div>
          </div>

          {/* --- COLUMN 2: MEDIA & DISTRIBUTION --- */}
          <div className="lg:col-span-5 space-y-6">
            <MediaPanel
              postType={postType}
              mediaFile={mediaFile}
              mediaPreview={mediaPreview}
              onMediaChange={handleMediaChange}
            />

            <DistributionPanel
              labels={labels}
              hashtags={hashtags}
              firstComment={firstComment}
              collaborators={collaborators}
              location={location}
              onLabelsChange={setLabels}
              onHashtagsChange={setHashtags}
              onFirstCommentChange={setFirstComment}
              onCollaboratorsChange={setCollaborators}
              onLocationChange={setLocation}
            />

            {/* --- SCHEDULE SECTION --- */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
                <h3 className="font-serif text-xl font-bold text-[--foreground]">
                  Schedule
                </h3>
                <Calendar className="w-4 h-4 text-[--muted]" />
              </div>

              <div className="bg-[--surface] border border-[--border] p-5 space-y-6 mt-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[--surface-hover]">
                    <input
                      type="radio"
                      name="timing"
                      checked={!isScheduling}
                      onChange={() => setIsScheduling(false)}
                      className="accent-[--foreground]"
                    />
                    <span className="font-serif text-sm">
                      Immediate Release
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[--surface-hover]">
                    <input
                      type="radio"
                      name="timing"
                      checked={isScheduling}
                      onChange={() => setIsScheduling(true)}
                      className="accent-[--foreground]"
                    />
                    <span className="font-serif text-sm">
                      Schedule for Later
                    </span>
                  </label>
                </div>

                {isScheduling && (
                  <div className="p-3 bg-[--background] border border-[--border] space-y-3">
                    <div>
                      <label htmlFor="date" className="eyebrow">
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        className="w-full p-2 border border-[--border] mt-1 font-serif"
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="eyebrow">
                        Time
                      </label>
                      <input
                        type="time"
                        id="time"
                        className="w-full p-2 border border-[--border] mt-1 font-serif"
                      />
                    </div>
                  </div>
                )}

                {/* PUBLISH BUTTON */}
                <div className="pt-4 border-t border-dashed border-[--border]">
                  <button className="w-full py-3 px-4 bg-[--foreground] text-[--background] font-serif font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                    <CheckSquare className="w-4 h-4" />
                    Send to Press
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-64"></div>
    </>
  );
}
