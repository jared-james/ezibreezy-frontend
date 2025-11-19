// app/(app)/calendar/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react"; // ADDED useEffect
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MonthView from "./components/month-view";
import WeekView from "./components/week-view";
import ListView from "./components/list-view";
import EditorialModal from "./components/editorial-modal";
import DayViewModal from "./components/day-view-modal";
import { useEditorialStore } from "@/lib/store/editorial-store"; // IMPORTED
import type { EditorialState } from "@/lib/store/editorial-store";
import { ScheduledPost } from "./types";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // IMPORTED useQueryClient
import {
  getScheduledPosts,
  getPostDetails,
  FullPostDetails,
} from "@/lib/api/publishing"; // IMPORTED getPostDetails, FullPostDetails
import { toast } from "sonner";

type CalendarView = "Month" | "Week" | "List";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<CalendarView>("Month");
  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);
  const [isDayViewModalOpen, setIsDayViewModalOpen] = useState(false);
  const [selectedDayPosts, setSelectedDayPosts] = useState<ScheduledPost[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const initializeFromFullPost = useEditorialStore(
    (state) => state.initializeFromFullPost
  ); // NEW ACTION
  const [postIdToEdit, setPostIdToEdit] = useState<string | null>(null); // NEW STATE

  const [modalContent, setModalContent] = useState<{
    type: "edit" | "new";
    data: ScheduledPost | Date;
  } | null>(null);

  // Query to fetch the list of scheduled/sent posts
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

  // Query to fetch a SINGLE full post for editing (Conditional Fetch)
  const {
    data: fullPostData,
    isLoading: isLoadingFullPost,
    isError: isErrorFullPost,
    error: errorFullPost,
    isFetching: isFetchingFullPost,
  } = useQuery<FullPostDetails>({
    queryKey: ["fullPostDetails", postIdToEdit],
    queryFn: () => getPostDetails(postIdToEdit!),
    enabled: !!postIdToEdit, // Only run when a post ID is set
    staleTime: Infinity,
  });

  // Effect to handle opening the modal once full data is fetched
  useEffect(() => {
    if (fullPostData && !isFetchingFullPost) {
      // Initialize the store with the full, rich data
      initializeFromFullPost(fullPostData);
      // Open the modal now that the store is populated
      setIsEditorialModalOpen(true);
      // Clear the ID so it doesn't try to refetch
      setPostIdToEdit(null);
    }

    if (isErrorFullPost) {
      toast.error(`Failed to load post for editing: ${errorFullPost.message}`);
      setPostIdToEdit(null);
    }
    // Only depend on fullPostData and isFetchingFullPost to trigger modal open
  }, [
    fullPostData,
    isFetchingFullPost,
    initializeFromFullPost,
    isErrorFullPost,
    errorFullPost,
  ]);

  // Handler for opening the day view modal from MonthView
  const handleOpenDayView = (date: Date, posts: ScheduledPost[]) => {
    setSelectedDay(date);
    setSelectedDayPosts(posts);
    setIsDayViewModalOpen(true);
  };

  const handleCloseDayView = () => {
    setIsDayViewModalOpen(false);
    setSelectedDay(null);
    setSelectedDayPosts([]);
    refetch();
  };

  // MODIFIED: This now only sets the ID and triggers the fetch
  const handleEditPost = (post: ScheduledPost) => {
    // If the post is already sent, it cannot be edited (only cloned)
    if (post.status === "sent") {
      toast.info(
        "Sent posts cannot be edited. A copy will be created for scheduling."
      );
      // Fall through to edit flow, letting the user modify the content
    }

    // Set the ID to trigger the fetching query
    setPostIdToEdit(post.id);
    // Close day view immediately so the backdrop is available for the editorial modal
    setIsDayViewModalOpen(false);
  };

  const handleNewPost = (date: Date) => {
    setModalContent({ type: "new", data: date });
    setIsEditorialModalOpen(true);
    setIsDayViewModalOpen(false);
  };

  const handleCloseEditorialModal = () => {
    setIsEditorialModalOpen(false);
    // Note: We no longer rely on modalContent for initialDraft, so clearing it is fine
    setModalContent(null);
    refetch();
  };

  // Memo for Modal Title (now only handles 'new' or loading state)
  const modalTitle = useMemo(() => {
    if (isLoadingFullPost || isFetchingFullPost) return "Loading Post...";
    if (fullPostData) return `Edit Scheduled Post`;
    return "Create New Post";
  }, [isLoadingFullPost, isFetchingFullPost, fullPostData]);

  // Pass an empty draft since the store is now populated by initializeFromFullPost
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

  if (isLoadingList || isLoadingFullPost) {
    // Check both loading states
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
      <div className="flex h-full w-full flex-col p-4 md:p-6">
        <div className="mb-8 border-b-4 border-double border-[--foreground] pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-2">The Schedule</p>
              <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-[--foreground] md:text-5xl">
                Content Calendar
              </h1>
            </div>
            <Button
              variant="primary"
              className="gap-2"
              onClick={() => handleNewPost(new Date())}
            >
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
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
            <h2 className="min-w-[200px] text-center font-serif text-xl font-bold text-[--foreground]">
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

          <div className="flex items-center gap-2 border border-border bg-surface p-1">
            {(["Month", "Week", "List"] as CalendarView[]).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={cn(
                  "px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                  activeView === view
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                )}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div>
          {activeView === "Month" && (
            <MonthView
              currentDate={currentDate}
              posts={scheduledPosts}
              onEditPost={handleEditPost}
              onNewPost={handleNewPost}
              onOpenDayView={handleOpenDayView}
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
          {activeView === "List" && <ListView posts={scheduledPosts} />}
        </div>
      </div>

      <EditorialModal
        isOpen={isEditorialModalOpen}
        onClose={handleCloseEditorialModal}
        title={modalTitle}
        initialDraft={initialDraft}
      />

      <DayViewModal
        isOpen={isDayViewModalOpen}
        onClose={handleCloseDayView}
        date={selectedDay}
        posts={scheduledPosts}
        onEditPost={handleEditPost}
        onNewPost={handleNewPost}
      />
    </>
  );
}
