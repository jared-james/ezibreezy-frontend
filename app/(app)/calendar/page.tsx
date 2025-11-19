// app/(app)/calendar/page.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MonthView from "./components/month-view";
import WeekView from "./components/week-view";
import ListView from "./components/list-view";
import EditorialModal from "./components/editorial-modal";
import { useEditorialStore } from "@/lib/store/editorial-store";
import type { EditorialState } from "@/lib/store/editorial-store";
import { ScheduledPost } from "./types";
import { useQuery } from "@tanstack/react-query";
import {
  getScheduledPosts,
  getPostDetails,
  FullPostDetails,
} from "@/lib/api/publishing";
import { toast } from "sonner";

type CalendarView = "Month" | "Week" | "List";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<CalendarView>("Month");
  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);

  const initializeFromFullPost = useEditorialStore(
    (state) => state.initializeFromFullPost
  );

  const [postIdToEdit, setPostIdToEdit] = useState<string | null>(null);

  const {
    data: scheduledPosts = [],
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
    refetch,
  } = useQuery<ScheduledPost[]>({
    queryKey: ["scheduledPosts"],
    queryFn: getScheduledPosts,
    staleTime: 60000,
  });

  const {
    data: fullPostData,
    isLoading: isLoadingFullPost,
    isError: isErrorFullPost,
    error: errorFullPost,
    isFetching: isFetchingFullPost,
  } = useQuery<FullPostDetails>({
    queryKey: ["fullPostDetails", postIdToEdit],
    queryFn: () => getPostDetails(postIdToEdit!),
    enabled: !!postIdToEdit,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (fullPostData && !isFetchingFullPost) {
      initializeFromFullPost(fullPostData);
      setIsEditorialModalOpen(true);
      setPostIdToEdit(null);
    }

    if (isErrorFullPost) {
      toast.error(`Failed to load post for editing: ${errorFullPost?.message}`);
      setPostIdToEdit(null);
    }
  }, [
    fullPostData,
    isFetchingFullPost,
    initializeFromFullPost,
    isErrorFullPost,
    errorFullPost,
  ]);

  const handleEditPost = (post: ScheduledPost) => {
    if (post.status === "sent") {
      toast.info("Sent posts cannot be edited. A copy will be created.");
    }

    setPostIdToEdit(post.id);
  };

  const handleNewPost = (date: Date) => {
    setIsEditorialModalOpen(true);
    initializeFromFullPost({} as any);
  };

  const handleCloseEditorialModal = () => {
    setIsEditorialModalOpen(false);
    refetch();
  };

  const modalTitle = useMemo(() => {
    if (isLoadingFullPost || isFetchingFullPost) return "Loading Post...";
    if (fullPostData) return "Edit Scheduled Post";
    return "Create New Post";
  }, [isLoadingFullPost, isFetchingFullPost, fullPostData]);

  const initialDraft = useMemo(() => ({} as Partial<EditorialState>), []);

  const navigateDate = (direction: "prev" | "next") => {
    const amount = direction === "next" ? 1 : -1;
    if (activeView === "Month") {
      setCurrentDate((current) => {
        const newDate = new Date(current);
        newDate.setMonth(current.getMonth() + amount);
        return newDate;
      });
    } else {
      setCurrentDate((current) => addDays(current, amount * 7));
    }
  };

  const getHeaderText = () => {
    if (activeView === "Month") {
      return format(currentDate, "MMMM yyyy");
    }
    return `Week of ${format(currentDate, "MMM d")}`;
  };

  const CreatePostButton = (
    <Button
      variant="primary"
      className="gap-2 shrink-0"
      onClick={() => handleNewPost(new Date())}
    >
      <Plus className="h-4 w-4" />
      Create Post
    </Button>
  );

  if (isLoadingList) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isErrorList) {
    toast.error(`Error loading schedule: ${errorList.message}`);
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <p className="font-serif text-error">
          Error loading scheduled posts. Please check your connections.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="mb-8 border-b-4 border-double border-foreground pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-2">The Schedule</p>
              <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
                Content Calendar
              </h1>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h2 className="min-w-[200px] text-center font-serif text-xl font-bold text-foreground">
              {getHeaderText()}
            </h2>

            <Button
              size="icon"
              variant="outline"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {(["Month", "Week", "List"] as CalendarView[]).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={cn(
                  "px-2 py-1 text-xs font-serif font-bold uppercase tracking-widest transition-all border-b-2 border-solid",
                  activeView === view
                    ? "text-foreground border-brand-primary border-dotted"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                )}
              >
                {view}
              </button>
            ))}

            {CreatePostButton}
          </div>
        </div>

        <div>
          {activeView === "Month" && (
            <MonthView
              currentDate={currentDate}
              posts={scheduledPosts}
              onEditPost={handleEditPost}
              onNewPost={handleNewPost}
              onOpenDayView={() => {}}
            />
          )}

          {activeView === "Week" && (
            <WeekView
              currentDate={currentDate}
              posts={scheduledPosts}
              onEditPost={handleEditPost}
              onNewPost={handleNewPost}
            />
          )}

          {activeView === "List" && (
            <ListView posts={scheduledPosts} onEditPost={handleEditPost} />
          )}
        </div>
      </div>

      <EditorialModal
        isOpen={isEditorialModalOpen}
        onClose={handleCloseEditorialModal}
        title={modalTitle}
        initialDraft={initialDraft}
      />
    </>
  );
}
