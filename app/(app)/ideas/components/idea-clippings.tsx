// app/(app)/ideas/components/idea-clippings.tsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Tag, Loader2, PenLine, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getContentLibrary,
  getPostDetails,
  FullPostDetails,
} from "@/lib/api/publishing";
import type { ScheduledPostResponse } from "@/lib/api/publishing";
import { format } from "date-fns";
import { toast } from "sonner";
import EditorialModal from "@/app/(app)/calendar/components/editorial-modal";
import { useEditorialDraftStore } from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useEditorialUIStore } from "@/lib/store/editorial/ui-store";
import { Button } from "@/components/ui/button";

const ideaLifecycleFilters = [
  "All Ideas",
  "Saved",
  "Developed",
  "Drafted",
  "Posted",
];

export default function IdeaClippings() {
  const [activeFilterTab, setActiveFilterTab] = useState("Saved");
  const [postIdToDevelop, setPostIdToDevelop] = useState<string | null>(null);
  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);
  const initDraft = useEditorialDraftStore((state) => state.initializeFromFullPost);
  const initPublishing = usePublishingStore((state) => state.initializeFromFullPost);
  const initUI = useEditorialUIStore((state) => state.initializeFromFullPost);

  const {
    data: allContent = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ScheduledPostResponse[]>({
    queryKey: ["contentLibrary"],
    queryFn: getContentLibrary,
    staleTime: 60000,
  });

  const draftPosts = useMemo(() => {
    return allContent
      .filter((post) => post.status === "draft")
      .sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
      );
  }, [allContent]);

  const {
    data: fullPostData,
    isLoading: isLoadingFullPost,
    isFetching: isFetchingFullPost,
    isError: isErrorFullPost,
    error: errorFullPost,
  } = useQuery<FullPostDetails>({
    queryKey: ["fullPostDetails", postIdToDevelop],
    queryFn: () => getPostDetails(postIdToDevelop!),
    enabled: !!postIdToDevelop,
    staleTime: Infinity,
  });

  if (fullPostData && !isFetchingFullPost && postIdToDevelop) {
    initDraft(fullPostData);
    initPublishing(fullPostData);
    initUI();
    setIsEditorialModalOpen(true);
    setPostIdToDevelop(null);
  }

  if (isErrorFullPost) {
    toast.error(`Failed to load idea: ${errorFullPost?.message}`);
    setPostIdToDevelop(null);
  }

  const handleDevelopIdea = (postId: string) => {
    setPostIdToDevelop(postId);
  };

  const handleCloseEditorialModal = () => {
    setIsEditorialModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-error bg-error/5 p-4 text-center">
        <p className="font-serif text-sm text-error">
          Error loading ideas: {error?.message}
        </p>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="mb-8 flex items-center justify-end border-b-2 border-foreground pb-3">
          <div className="flex items-center gap-2 border border-border bg-surface p-1">
            {ideaLifecycleFilters.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilterTab(tab)}
                className={cn(
                  "px-3 py-1 text-xs font-bold uppercase tracking-wider",
                  activeFilterTab === tab
                    ? "bg-foreground text-background"
                    : "text-muted hover:bg-surface-hover"
                )}
                disabled={tab !== "Saved"}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {isLoadingFullPost && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
            <p className="ml-2 font-serif text-sm text-foreground">
              Loading idea for development...
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {draftPosts.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 py-12 text-center border-2 border-dashed border-border">
              <p className="font-serif text-muted-foreground">
                You have no saved ideas. Generate one with the AI Briefing tab!
              </p>
            </div>
          ) : (
            draftPosts.map((post) => (
              <div
                key={post.id}
                className="group flex flex-col justify-between border border-border bg-card p-5 transition-colors hover:border-foreground"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="border border-border bg-surface px-2 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-foreground">
                      Draft
                    </span>
                    <span className="font-serif text-xs italic text-muted-foreground">
                      {format(new Date(post.scheduledAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  <h3 className="mb-2 font-serif text-xl font-bold text-foreground">
                    {post.title || "Untitled Idea"}
                  </h3>
                  <p className="mb-4 line-clamp-4 font-serif text-sm leading-relaxed text-muted-foreground">
                    {post.content}
                  </p>

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                      {post.platform}
                    </span>
                    <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                      @{post.platformUsername}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-border pt-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => handleDevelopIdea(post.id)}
                      variant="primary"
                      className="gap-2"
                      disabled={isLoadingFullPost}
                    >
                      <PenLine className="h-4 w-4" />
                      Develop in Editorial
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <EditorialModal
        isOpen={isEditorialModalOpen}
        onClose={handleCloseEditorialModal}
        title="Develop Idea"
      />
    </>
  );
}
