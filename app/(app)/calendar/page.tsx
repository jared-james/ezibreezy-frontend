// app/(app)/calendar/page.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { addDays, format, parseISO, isSameDay, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import MonthView from "./components/month-view";
import WeekView from "./components/week-view";
import ListView from "./components/list-view";
import EditorialModal from "./components/editorial-modal";
import { ScheduledPost } from "./types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContentLibrary,
  getPostDetails,
  FullPostDetails,
  reschedulePostOnly,
  RescheduleOnlyPayload,
} from "@/lib/api/publishing";
import { useClientData } from "@/lib/hooks/use-client-data";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  useEditorialDraftStore,
  MediaItem,
} from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useEditorialUIStore } from "@/lib/store/editorial/ui-store";

type CalendarView = "Month" | "Week" | "List";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<CalendarView>("Month");
  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);

  const [pendingReschedule, setPendingReschedule] = useState<{
    postId: string;
    payload: RescheduleOnlyPayload;
    originalTime: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const setDraftState = useEditorialDraftStore((state) => state.setDraftState);
  const setStagedMediaItems = useEditorialDraftStore(
    (state) => state.setStagedMediaItems
  );
  const resetDraft = useEditorialDraftStore((state) => state.resetDraft);

  const setPublishingState = usePublishingStore(
    (state) => state.setPublishingState
  );
  const resetPublishing = usePublishingStore((state) => state.resetPublishing);

  const resetUI = useEditorialUIStore((state) => state.resetUI);

  const [postIdToEdit, setPostIdToEdit] = useState<string | null>(null);

  const { userId } = useClientData();

  const {
    data: allContent = [],
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
    refetch,
  } = useQuery<ScheduledPost[]>({
    queryKey: ["contentLibrary"],
    queryFn: getContentLibrary,
    staleTime: 60000,
  });

  const scheduledPosts = useMemo(() => {
    return allContent.filter(
      (post) =>
        post.status !== "draft" &&
        post.status !== "failed" &&
        post.status !== "cancelled"
    );
  }, [allContent]);

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
    staleTime: 0,
  });

  useEffect(() => {
    if (fullPostData && !isFetchingFullPost && postIdToEdit) {
      const newMediaItems: MediaItem[] = [];
      const mediaMap = fullPostData.allMedia || {};
      const idToUidMap = new Map<string, string>();

      const allMediaIds = Array.from(
        new Set([
          ...fullPostData.mediaIds,
          ...(fullPostData.threadMessages || []).flatMap((m) => m.mediaIds),
        ])
      );

      allMediaIds.forEach((mediaId) => {
        const mediaRecord = mediaMap[mediaId];
        if (mediaRecord) {
          const uid = crypto.randomUUID();
          idToUidMap.set(mediaId, uid);

          newMediaItems.push({
            uid,
            id: mediaId,
            file: null,
            preview: mediaRecord.url,
            mediaUrl: mediaRecord.url,
            isUploading: false,
            type: mediaRecord.type.startsWith("video") ? "video" : "image",
          });
        }
      });

      setStagedMediaItems(newMediaItems);

      const threadMessages = (fullPostData.threadMessages || []).map((msg) => ({
        content: msg.content,
        mediaIds: msg.mediaIds
          .map((id) => idToUidMap.get(id))
          .filter(Boolean) as string[],
      }));

      const platform = fullPostData.integration.platform;

      setDraftState({
        mainCaption:
          fullPostData.settings?.canonicalContent || fullPostData.content,
        platformMediaSelections: {
          [platform]: fullPostData.mediaIds
            .map((id) => idToUidMap.get(id))
            .filter(Boolean) as string[],
        },
        platformThreadMessages: {
          [platform]: threadMessages,
        },
        threadMessages: threadMessages,
      });

      setPublishingState({
        selectedAccounts: {
          [platform]: [fullPostData.integrationId],
        },
      });

      setPostIdToEdit(null);
    }

    if (isErrorFullPost) {
      toast.error(`Failed to load post for editing: ${errorFullPost?.message}`);
      setPostIdToEdit(null);
      setIsEditorialModalOpen(false);
    }
  }, [
    fullPostData,
    isFetchingFullPost,
    isErrorFullPost,
    errorFullPost,
    postIdToEdit,
    setDraftState,
    setStagedMediaItems,
    setPublishingState,
  ]);

  const rescheduleMutation = useMutation({
    mutationFn: (variables: {
      postId: string;
      payload: RescheduleOnlyPayload;
    }) => reschedulePostOnly(variables.postId, variables.payload),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["contentLibrary"] });

      const previousContent = queryClient.getQueryData<ScheduledPost[]>([
        "contentLibrary",
      ]);

      queryClient.setQueryData<ScheduledPost[]>(["contentLibrary"], (old) => {
        if (!old) return previousContent || [];

        return old.map((post) => {
          if (post.id === variables.postId) {
            return {
              ...post,
              scheduledAt: variables.payload.scheduledAt,
            };
          }
          return post;
        });
      });

      return { previousContent };
    },

    onSuccess: () => {
      toast.success("Post successfully rescheduled!");
      refetch();
    },

    onError: (error: any, variables, context) => {
      if (context?.previousContent) {
        queryClient.setQueryData(["contentLibrary"], context.previousContent);
      }
      toast.error(`Rescheduling failed: ${error.message}`);
    },
  });

  const lockedPostId =
    (rescheduleMutation.isPending
      ? rescheduleMutation.variables?.postId
      : null) || pendingReschedule?.postId;

  const handleEditPost = (post: ScheduledPost) => {
    if (post.status === "sent") {
      toast.info("Sent posts cannot be edited. A copy will be created.");
    }
    resetDraft();
    resetPublishing();
    resetUI();

    setIsEditorialModalOpen(true);
    setPostIdToEdit(post.id);
  };

  const handleNewPost = (date: Date) => {
    resetDraft();
    resetPublishing();
    resetUI();
    setPublishingState({
      scheduleDate: format(date, "yyyy-MM-dd"),
      isScheduling: true,
    });
    setIsEditorialModalOpen(true);
  };

  const handleCloseEditorialModal = () => {
    setIsEditorialModalOpen(false);
    refetch();
  };

  const executeReschedule = async (
    postId: string,
    payload: RescheduleOnlyPayload
  ) => {
    try {
      await rescheduleMutation.mutateAsync({ postId, payload });
      setPendingReschedule(null);
    } catch (error: any) {}
  };

  const handleDropPost = async (postId: string, newDate: Date) => {
    if (rescheduleMutation.isPending) return;

    if (!userId) {
      toast.error("Authentication error: User ID not found.");
      return;
    }

    const originalPost = allContent.find((p) => p.id === postId);

    if (!originalPost || originalPost.status === "sent") {
      toast.info(
        originalPost?.status === "sent"
          ? "Cannot move a sent post."
          : "Post data missing. Cannot move."
      );
      return;
    }

    if (isSameDay(new Date(originalPost.scheduledAt), newDate)) {
      return;
    }

    let newScheduledTimeStr: string;

    if (originalPost.scheduledAt) {
      const originalDateTime = parseISO(originalPost.scheduledAt);
      const updatedDateTime = new Date(newDate);

      updatedDateTime.setHours(
        originalDateTime.getHours(),
        originalDateTime.getMinutes(),
        originalDateTime.getSeconds(),
        originalDateTime.getMilliseconds()
      );

      if (isBefore(updatedDateTime, new Date())) {
        setPendingReschedule({
          postId,
          originalTime: format(originalDateTime, "h:mm a"),
          payload: { scheduledAt: updatedDateTime.toISOString() },
        });
        return;
      }

      newScheduledTimeStr = updatedDateTime.toISOString();
    } else {
      const fallbackDateTime = new Date(newDate);
      fallbackDateTime.setHours(12, 0, 0, 0);
      newScheduledTimeStr = fallbackDateTime.toISOString();
    }

    const payload: RescheduleOnlyPayload = {
      scheduledAt: newScheduledTimeStr,
    };

    await executeReschedule(postId, payload);
  };

  const modalTitle = useMemo(() => {
    if (isLoadingFullPost || isFetchingFullPost) return "Loading Post...";
    if (fullPostData)
      return fullPostData.status === "draft"
        ? "Develop Idea"
        : "Edit Scheduled Post";
    return "Create New Post";
  }, [isLoadingFullPost, isFetchingFullPost, fullPostData]);

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
      <div className="flex h-full w-full flex-col p-6">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b-4 border-double border-foreground pb-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-2">The Schedule</p>
            <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              Content Calendar
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface p-1 shadow-sm">
              {(["Month", "Week", "List"] as CalendarView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
                    activeView === view
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  )}
                >
                  {view}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary"
              onClick={() => handleNewPost(new Date())}
            >
              <Plus className="h-4 w-4" />
              Create Post
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateDate("prev")}
              className="btn btn-icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <h2 className="min-w-[200px] text-center font-serif text-2xl font-bold text-foreground">
              {getHeaderText()}
            </h2>

            <button
              onClick={() => navigateDate("next")}
              className="btn btn-icon"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-lg border border-foreground bg-surface shadow-sm">
          {activeView === "Month" && (
            <MonthView
              currentDate={currentDate}
              posts={scheduledPosts}
              onEditPost={handleEditPost}
              onNewPost={handleNewPost}
              onDropPost={handleDropPost}
              onOpenDayView={() => {}}
              lockedPostId={lockedPostId}
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
        isLoading={isLoadingFullPost || isFetchingFullPost}
      />

      <AlertDialog
        open={!!pendingReschedule}
        onOpenChange={(open) => !open && setPendingReschedule(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Past Schedule Warning
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              You moved this post to a time ({pendingReschedule?.originalTime})
              that has already passed for today.
              <br />
              <br />
              <strong>
                This will trigger the post to be published immediately.
              </strong>
              <br />
              Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPendingReschedule(null);
                refetch();
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90"
              onClick={() => {
                if (pendingReschedule) {
                  executeReschedule(
                    pendingReschedule.postId,
                    pendingReschedule.payload
                  );
                }
              }}
            >
              Yes, Publish Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
