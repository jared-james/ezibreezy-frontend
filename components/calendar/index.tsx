// components/calendar/index.tsx

"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Hooks
import { useCalendarState } from "./hooks/use-calendar-state";
import { useCalendarData } from "./hooks/use-calendar-data";
import { useCalendarNavigation } from "./hooks/use-calendar-navigation";
import { usePostReschedule } from "./hooks/use-post-reschedule";
import { usePostEditorWorkflow } from "./hooks/use-post-editor-workflow";

// Components
import CalendarHeader from "./components/calendar-header";
import CalendarNavigation from "./components/calendar-navigation";

// Views
import MonthView from "./views/month-view";
import WeekView from "./views/week-view";
import ListView from "./views/list-view";

// Modals
import EditorialModal from "./modals/editorial-modal";
import RescheduleConfirmationModal from "./modals/reschedule-confirmation-modal";

export default function CalendarContainer() {
  // Calendar state hook
  const calendarState = useCalendarState();

  // Data fetching hook
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
  });

  // Navigation hook
  const navigation = useCalendarNavigation({
    currentDate: calendarState.currentDate,
    activeView: calendarState.activeView,
    setCurrentDate: calendarState.setCurrentDate,
  });

  // Reschedule hook
  const reschedule = usePostReschedule();

  // Post editor workflow hook
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

  // Modal title computation
  const modalTitle = useMemo(() => {
    if (isLoadingFullPost || isFetchingFullPost) return "Loading Post...";
    if (fullPostData)
      return fullPostData.status === "draft"
        ? "Develop Idea"
        : "Edit Scheduled Post";
    return "Create New Post";
  }, [isLoadingFullPost, isFetchingFullPost, fullPostData]);

  // Handle close editorial modal
  const handleCloseEditorialModal = () => {
    calendarState.closeEditorialModal();
    refetch();
  };

  // Handle drop post (wrapper to pass allContent)
  const handleDropPost = (postId: string, newDate: Date) => {
    reschedule.handleDropPost(postId, newDate, allContent);
  };

  // Handle confirm pending reschedule (wrapper to refetch after)
  const handleConfirmReschedule = () => {
    reschedule.confirmPendingReschedule();
  };

  // Handle cancel pending reschedule (wrapper to refetch after)
  const handleCancelReschedule = () => {
    reschedule.cancelPendingReschedule();
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (isError) {
    toast.error(`Error loading schedule: ${error?.message}`);
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
      {/* Reduced padding (p-4) until 1536px (2xl), then p-6 */}
      <div className="flex h-full w-full flex-col p-4 2xl:p-6">
        {/* Calendar Header with Filters */}
        <CalendarHeader
          activeView={calendarState.activeView}
          onViewChange={calendarState.setActiveView}
          onCreatePost={() => editor.handleNewPost(new Date())}
          filters={calendarState.filters}
          onFilterChange={calendarState.updateFilter}
        />

        {/* Calendar Navigation */}
        <CalendarNavigation
          headerText={navigation.getHeaderText()}
          onNavigate={navigation.navigateDate}
        />

        {/* Active View */}
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

      {/* Editorial Modal */}
      <EditorialModal
        isOpen={calendarState.isEditorialModalOpen}
        onClose={handleCloseEditorialModal}
        title={modalTitle}
        isLoading={isLoadingFullPost || isFetchingFullPost}
        selectedPost={calendarState.selectedPost}
        onReuse={editor.handleReusePost}
      />

      {/* Reschedule Confirmation Modal */}
      <RescheduleConfirmationModal
        isOpen={!!reschedule.pendingReschedule}
        onConfirm={handleConfirmReschedule}
        onCancel={handleCancelReschedule}
        originalTime={reschedule.pendingReschedule?.originalTime || ""}
      />
    </>
  );
}
