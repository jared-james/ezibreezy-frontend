// app/(app)/calendar/page.tsx
"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { addDays, subDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MonthView from "./components/month-view";
import WeekView from "./components/week-view";
import ListView from "./components/list-view";
import EditorialModal from "./components/editorial-modal";
import type { EditorialState } from "@/lib/store/editorial-store";
import { ScheduledPost } from "./types";

// --- PLACEHOLDER DATA ---
const placeholderPosts: ScheduledPost[] = [
  {
    id: "post-1",
    title: "The future of AI in marketing strategies",
    scheduledAt: new Date().toISOString(),
    platforms: ["x", "linkedin"],
  },
  {
    id: "post-2",
    title: "New feature launch: The Editorial Desk",
    scheduledAt: addDays(new Date(), 2).toISOString(),
    platforms: ["instagram"],
  },
  {
    id: "post-3",
    title: "Weekly thoughts on building in public",
    scheduledAt: subDays(new Date(), 5).toISOString(),
    platforms: ["x"],
  },
];
// -----------------------

type CalendarView = "Month" | "Week" | "List";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<CalendarView>("Month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    type: "edit" | "new";
    data: ScheduledPost | Date;
  } | null>(null);

  const handleEditPost = (post: ScheduledPost) => {
    setModalContent({ type: "edit", data: post });
    setIsModalOpen(true);
  };

  const handleNewPost = (date: Date) => {
    setModalContent({ type: "new", data: date });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    // Here you would also trigger a refetch of the calendar data
  };

  const { modalTitle, initialDraft } = useMemo(() => {
    if (!modalContent) return { modalTitle: "Create Post", initialDraft: {} };

    if (modalContent.type === "edit") {
      const post = modalContent.data as ScheduledPost;
      const postDate = new Date(post.scheduledAt);
      return {
        modalTitle: "Edit Scheduled Post",
        initialDraft: {
          mainCaption: post.title, // Assuming title maps to mainCaption for now
          isScheduling: true,
          scheduleDate: format(postDate, "yyyy-MM-dd"),
          scheduleTime: format(postDate, "HH:mm"),
          // In a real app, you would fetch the full post data here
        } as Partial<EditorialState>,
      };
    } else {
      // 'new'
      const date = modalContent.data as Date;
      return {
        modalTitle: "Create New Post",
        initialDraft: {
          isScheduling: true,
          scheduleDate: format(date, "yyyy-MM-dd"),
          scheduleTime: "12:00",
        } as Partial<EditorialState>,
      };
    }
  }, [modalContent]);

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

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col p-4 md:p-6">
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
              posts={placeholderPosts}
              onEditPost={handleEditPost}
              onNewPost={handleNewPost}
            />
          )}
          {activeView === "Week" && (
            <WeekView currentDate={currentDate} posts={placeholderPosts} />
          )}
          {activeView === "List" && <ListView posts={placeholderPosts} />}
        </div>
      </div>

      <EditorialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        initialDraft={initialDraft}
      />
    </>
  );
}
