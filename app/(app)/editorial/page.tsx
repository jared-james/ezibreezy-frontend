// app/(app)/editorial/page.tsx

"use client";

import { useState } from "react";
import {
  FileText,
  Send,
  CheckSquare,
  Image as ImageIcon,
  Video,
  Type,
  Link2,
  AtSign,
  Hash,
  MapPin,
  Smile,
  Lightbulb,
  Tag,
  PlusCircle,
} from "lucide-react";

// MOCK DATA: Includes nested accounts for each platform
const platforms = [
  {
    id: "twitter",
    name: "Twitter/X",
    accounts: [
      { id: "tw1", name: "@thebreezyco", img: "/placeholder-pfp.png" },
      { id: "tw2", name: "@personal", img: "/placeholder-pfp.png" },
      { id: "tw3", name: "@sidehustle", img: "/placeholder-pfp.png" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    accounts: [
      { id: "ig1", name: "breezy_times", img: "/placeholder-pfp.png" },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    accounts: [{ id: "li1", name: "John Doe", img: "/placeholder-pfp.png" }],
  },
  { id: "facebook", name: "Facebook", accounts: [] },
  { id: "tiktok", name: "TikTok", accounts: [] },
  { id: "youtube", name: "YouTube", accounts: [] },
];

// Define the shape for selected accounts state
type SelectedAccounts = Record<string, string[]>;

export default function EditorialPage() {
  const [postType, setPostType] = useState<"text" | "image" | "video">("text");
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<SelectedAccounts>({
    twitter: ["tw1"], // Default to selecting the first Twitter account
  });

  // Toggles the selection of a specific account under a platform
  const handleAccountSelect = (platformId: string, accountId: string) => {
    setSelectedAccounts((prev) => {
      const currentSelection = prev[platformId] || [];
      const newSelection = currentSelection.includes(accountId)
        ? currentSelection.filter((id) => id !== accountId)
        : [...currentSelection, accountId];

      if (newSelection.length === 0) {
        const { [platformId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [platformId]: newSelection };
    });
  };

  return (
    <div className="h-full flex flex-col w-full max-w-7xl mx-auto p-4 md:p-6">
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
            <div>
              <label className="eyebrow">Post Type</label>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setPostType("text")}
                  className={`btn btn-sm ${
                    postType === "text"
                      ? "bg-[--foreground] text-[--background]"
                      : ""
                  }`}
                >
                  <Type className="w-4 h-4" /> Text
                </button>
                <button
                  onClick={() => setPostType("image")}
                  className={`btn btn-sm ${
                    postType === "image"
                      ? "bg-[--foreground] text-[--background]"
                      : ""
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> Image
                </button>
                <button
                  onClick={() => setPostType("video")}
                  className={`btn btn-sm ${
                    postType === "video"
                      ? "bg-[--foreground] text-[--background]"
                      : ""
                  }`}
                >
                  <Video className="w-4 h-4" /> Video
                </button>
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="caption"
                className="eyebrow flex justify-between items-center mb-2"
              >
                Caption{" "}
                <button className="text-[--muted] hover:text-[--foreground]">
                  <Smile className="w-4 h-4" />
                </button>
              </label>
              <textarea
                id="caption"
                rows={10}
                placeholder="Once upon a time..."
                className="w-full bg-white font-serif p-4 border border-[--border] focus:border-[--foreground] focus:ring-1 focus:ring-[--foreground] transition-colors"
              />
            </div>
            {(postType === "image" || postType === "video") && (
              <div>
                <label className="eyebrow">Assets</label>
                <div className="mt-2 w-full h-48 border-2 border-dashed border-[--border] flex flex-col items-center justify-center text-center p-4 hover:border-[--foreground] transition-colors">
                  <p className="font-serif text-sm text-[--muted]">
                    Drag & drop your files here
                  </p>
                  <p className="text-xs uppercase tracking-wider text-[--muted-foreground] mt-1">
                    or click to browse
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- COLUMN 2: DISTRIBUTION --- */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-[--foreground] pb-2">
            <h2 className="font-serif text-xl font-bold text-[--foreground]">
              Distribution
            </h2>
            <Send className="w-4 h-4 text-[--muted]" />
          </div>

          <div className="bg-[--surface] border border-[--border] p-5 space-y-6">
            {/* CHANNELS */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="eyebrow text-[--foreground]">Channels</p>
                <a
                  href="/settings/connections"
                  className="flex items-center gap-2 text-xs font-serif text-[--brand-accent] hover:underline"
                >
                  <PlusCircle className="w-3 h-3" />
                  Connect Accounts
                </a>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[--border] pt-4">
                {platforms.map((platform) => (
                  <div key={platform.id}>
                    <p className="font-serif text-sm font-bold text-[--foreground] mb-2">
                      {platform.name}
                    </p>
                    <div className="space-y-2">
                      {platform.accounts.length > 0 ? (
                        platform.accounts.map((acc) => {
                          const isSelected = selectedAccounts[
                            platform.id
                          ]?.includes(acc.id);
                          return (
                            <div
                              key={acc.id}
                              onClick={() =>
                                handleAccountSelect(platform.id, acc.id)
                              }
                              className={`flex items-center gap-2 cursor-pointer p-1 rounded-sm transition-colors ${
                                isSelected
                                  ? "bg-[--brand-primary]/20"
                                  : "hover:bg-[--surface-hover]"
                              }`}
                            >
                              <div
                                className={`relative w-6 h-6 rounded-full bg-gray-300 ring-1 ring-offset-1 ${
                                  isSelected
                                    ? "ring-[--brand-primary]"
                                    : "ring-transparent"
                                }`}
                              >
                                {/* <img src={acc.img} ... /> */}
                              </div>
                              <span className="font-serif text-xs text-[--foreground] truncate">
                                {acc.name}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="font-serif text-xs text-[--muted-foreground] italic py-1">
                          Not connected
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DETAILS (RESTORED) */}
            <div className="space-y-4 pt-4 border-t border-dashed border-[--border]">
              <div className="relative">
                <label htmlFor="labels" className="eyebrow">
                  Labels
                </label>
                <Tag className="w-3 h-3 absolute top-9 left-3 text-[--muted-foreground]" />
                <input
                  id="labels"
                  placeholder="Promotion, News, Evergreen..."
                  className="w-full font-serif p-2 pl-8 border border-[--border] mt-2"
                />
              </div>
              <div className="relative">
                <label htmlFor="hashtags" className="eyebrow">
                  Hashtags
                </label>
                <Hash className="w-3 h-3 absolute top-9 left-3 text-[--muted-foreground]" />
                <input
                  id="hashtags"
                  placeholder="#business #marketing"
                  className="w-full font-serif p-2 pl-8 border border-[--border] mt-2"
                />
              </div>
              <div className="relative">
                <label htmlFor="mentions" className="eyebrow">
                  Mentions / Tags
                </label>
                <AtSign className="w-3 h-3 absolute top-9 left-3 text-[--muted-foreground]" />
                <input
                  id="mentions"
                  placeholder="@username"
                  className="w-full font-serif p-2 pl-8 border border-[--border] mt-2"
                />
              </div>
              <div className="relative">
                <label htmlFor="location" className="eyebrow">
                  Location
                </label>
                <MapPin className="w-3 h-3 absolute top-9 left-3 text-[--muted-foreground]" />
                <input
                  id="location"
                  placeholder="New York, NY"
                  className="w-full font-serif p-2 pl-8 border border-[--border] mt-2"
                />
              </div>
              <div className="relative">
                <label htmlFor="url" className="eyebrow">
                  URL / Bio Link
                </label>
                <Link2 className="w-3 h-3 absolute top-9 left-3 text-[--muted-foreground]" />
                <input
                  id="url"
                  placeholder="https://example.com"
                  className="w-full font-serif p-2 pl-8 border border-[--border] mt-2"
                />
              </div>
            </div>

            {/* TIMING */}
            <div className="pt-4 border-t border-dashed border-[--border]">
              <p className="eyebrow mb-3 text-[--foreground]">Timing</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[--surface-hover]">
                  <input
                    type="radio"
                    name="timing"
                    checked={!isScheduling}
                    onChange={() => setIsScheduling(false)}
                    className="accent-[--foreground]"
                  />
                  <span className="font-serif text-sm">Immediate Release</span>
                </label>
                <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[--surface-hover]">
                  <input
                    type="radio"
                    name="timing"
                    checked={isScheduling}
                    onChange={() => setIsScheduling(true)}
                    className="accent-[--foreground]"
                  />
                  <span className="font-serif text-sm">Schedule for Later</span>
                </label>
              </div>
              {isScheduling && (
                <div className="mt-4 p-3 bg-[--background] border border-[--border] space-y-3">
                  <div>
                    <label
                      htmlFor="date"
                      className="text-xs uppercase tracking-wider text-[--muted]"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="w-full p-2 border border-[--border] mt-1 font-serif"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className="text-xs uppercase tracking-wider text-[--muted]"
                    >
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
            </div>

            {/* PUBLISH */}
            <div className="pt-4">
              <button className="w-full py-3 px-4 bg-[--foreground] text-[--background] font-serif font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                <CheckSquare className="w-4 h-4" />
                Send to Press
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
