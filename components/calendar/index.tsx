// components/calendar/index.tsx

"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useCalendarState } from "./hooks/use-calendar-state";
import { useCalendarData } from "./hooks/use-calendar-data";
import { useCalendarNavigation } from "./hooks/use-calendar-navigation";
import { usePostReschedule } from "./hooks/use-post-reschedule";
import { usePostEditorWorkflow } from "./hooks/use-post-editor-workflow";
import { useDeletePost } from "./hooks/use-delete-post";

import CalendarHeader from "./components/calendar-header";
import CalendarNavigation from "./components/calendar-navigation";

import MonthView from "./views/month-view";
import WeekView from "./views/week-view";
import ListView from "./views/list-view";

import EditorialModal from "./modals/editorial-modal";
import RescheduleConfirmationModal from "./modals/reschedule-confirmation-modal";
import type { ScheduledPost } from "./types";

// === ADD PROP INTERFACE ===
interface CalendarContainerProps {
  initialPosts?: ScheduledPost[];
}

// === UPDATE FUNCTION SIGNATURE ===
export default function CalendarContainer({
  initialPosts,
}: CalendarContainerProps) {
  const calendarState = useCalendarState();
  const { handleDeletePost } = useDeletePost();

  const {
    scheduledPosts,
    isLoading,
    isError,
    error,
    refetch,
    fullPostData,
    isLoadingFullPost,
    isErrorFullPost,
    errorFullPost,
    isFetchingFullPost,
    allContent,
  } = useCalendarData({
    postIdToEdit: calendarState.selectedPost?.id || null,
    filters: calendarState.filters,
    activeView: calendarState.activeView,
    currentDate: calendarState.currentDate,
  });

  const navigation = useCalendarNavigation({
    currentDate: calendarState.currentDate,
    activeView: calendarState.activeView,
    setCurrentDate: calendarState.setCurrentDate,
  });

  const reschedule = usePostReschedule();

  const editor = usePostEditorWorkflow({
    fullPostData,
    isFetchingFullPost,
    isErrorFullPost,
    errorFullPost,
    selectedPost: calendarState.selectedPost,
    setSelectedPost: calendarState.setSelectedPost,
    openEditorialModal: calendarState.openEditorialModal,
    closeEditorialModal: calendarState.closeEditorialModal,
  });

  const modalTitle = useMemo(() => {
    if (isLoadingFullPost || isFetchingFullPost) return "Loading Post...";
    if (fullPostData)
      return fullPostData.status === "draft"
        ? "Develop Idea"
        : "Edit Scheduled Post";
    return "Create New Post";
  }, [isLoadingFullPost, isFetchingFullPost, fullPostData]);

  const handleCloseEditorialModal = () => {
    calendarState.closeEditorialModal();
    refetch();
  };

  const handleDropPost = (postId: string, newDate: Date) => {
    reschedule.handleDropPost(postId, newDate, allContent);
  };

  const handleConfirmReschedule = () => {
    reschedule.confirmPendingReschedule();
  };

  const handleCancelReschedule = () => {
    reschedule.cancelPendingReschedule();
    refetch();
  };

  // === UPDATED LOADING CHECK ===
  // If we have initialData, we are not "loading" visually, even if fetching in bg
  const showLoading = isLoading && !initialPosts;

  if (showLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error handling remains similar...
  if (isError) {
    const errorMessage = error?.message?.toLowerCase() || "";
    const isExpectedEmptyState =
      errorMessage.includes("no channels") ||
      errorMessage.includes("no connections") ||
      errorMessage.includes("no integrations") ||
      errorMessage.includes("not found") ||
      scheduledPosts.length === 0;

    if (!isExpectedEmptyState) {
      toast.error(`Error loading schedule: ${error?.message}`);
      return (
        <div className="flex h-full w-full items-center justify-center p-8">
          <p className="font-serif text-error">
            Error loading scheduled posts. Please check your connections.
          </p>
        </div>
      );
    }
  }

  return (
    <>
      <div className="flex h-full w-full flex-col p-4 2xl:p-6">
        <CalendarHeader
          activeView={calendarState.activeView}
          onViewChange={calendarState.setActiveView}
          onCreatePost={() => editor.handleNewPost(new Date())}
          filters={calendarState.filters}
          onFilterChange={calendarState.updateFilter}
        />

        <CalendarNavigation
          headerText={navigation.getHeaderText()}
          onNavigate={navigation.navigateDate}
        />

        <div className="flex-1 overflow-hidden rounded-lg bg-surface shadow-none">
          {calendarState.activeView === "Month" && (
            <MonthView
              currentDate={calendarState.currentDate}
              posts={scheduledPosts}
              onEditPost={editor.handleEditPost}
              onNewPost={editor.handleNewPost}
              onDropPost={handleDropPost}
              onOpenDayView={() => {}}
              lockedPostId={reschedule.lockedPostId}
            />
          )}

          {calendarState.activeView === "Week" && (
            <WeekView
              currentDate={calendarState.currentDate}
              posts={scheduledPosts}
              onEditPost={editor.handleEditPost}
              onNewPost={editor.handleNewPost}
            />
          )}

          {calendarState.activeView === "List" && (
            <ListView
              posts={scheduledPosts}
              onEditPost={editor.handleEditPost}
            />
          )}
        </div>
      </div>

      <EditorialModal
        isOpen={calendarState.isEditorialModalOpen}
        onClose={handleCloseEditorialModal}
        title={modalTitle}
        isLoading={isLoadingFullPost || isFetchingFullPost}
        selectedPost={calendarState.selectedPost}
        onReuse={editor.handleReusePost}
        onDelete={handleDeletePost}
      />

      <RescheduleConfirmationModal
        isOpen={!!reschedule.pendingReschedule}
        onConfirm={handleConfirmReschedule}
        onCancel={handleCancelReschedule}
        originalTime={reschedule.pendingReschedule?.originalTime || ""}
      />
    </>
  );
}
