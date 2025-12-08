// components/calendar/modals/editorial-modal.tsx

"use client";

import { useState, useMemo } from "react";
import { X, Loader2, Trash2, FileDown, RefreshCw } from "lucide-react";
import { useEditorialDraftStore } from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useEditorialUIStore } from "@/lib/store/editorial/ui-store";
import EditorialCore from "@/components/post-editor";
import ReadOnlyPostViewer from "../components/read-only-post-viewer";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import type { ScheduledPost } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EditorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  isLoading?: boolean;
  selectedPost?: ScheduledPost | null;
  onReuse?: () => void;
  onDelete?: (postId: string) => Promise<any>;
}

export default function EditorialModal({
  isOpen,
  onClose,
  title: parentTitle = "Create New Post",
  isLoading = false,
  selectedPost,
  onReuse,
  onDelete,
}: EditorialModalProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetDraft = useEditorialDraftStore((state) => state.resetDraft);
  const resetPublishing = usePublishingStore((state) => state.resetPublishing);
  const resetUI = useEditorialUIStore((state) => state.resetUI);

  const handleClose = () => {
    resetDraft();
    resetPublishing();
    resetUI();
    setIsDeleting(false);
    setShowDeleteModal(false);
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPost && onDelete) {
      setIsDeleting(true);
      try {
        await onDelete(selectedPost.id);
        setShowDeleteModal(false);
        handleClose();
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  const handleConvertToDraft = () => {
    toast.info("Convert to draft functionality coming soon.");
  };

  // === INSTANT TITLE LOGIC ===
  // We derive the title immediately from selectedPost to avoid "Loading..." flash
  const displayTitle = useMemo(() => {
    if (selectedPost) {
      return selectedPost.status === "draft"
        ? "Develop Idea"
        : "Edit Scheduled Post";
    }
    // Fallback to parent title (usually "Loading Post..." or "Create New Post")
    return parentTitle;
  }, [selectedPost, parentTitle]);

  if (!isOpen) return null;

  const isSent = selectedPost?.status === "sent";
  const isScheduled = selectedPost?.status === "scheduled";
  // Check if we are editing an existing post (not creating a new one)
  const isExistingPost = !!selectedPost;

  // === OPTIMISTIC LOADING LOGIC ===
  // We only block the UI if we have absolutely NO data (e.g. deep link without cache).
  // If selectedPost exists (clicked from calendar), we render immediately.
  const showBlockingSpinner = isLoading && !selectedPost;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
          {isSent && selectedPost ? (
            <ReadOnlyPostViewer
              post={selectedPost}
              onReuse={() => {
                if (onReuse) onReuse();
              }}
              onClose={handleClose}
              onDelete={onDelete ? handleDeleteClick : undefined}
            />
          ) : (
            <>
              {/* Editor Header */}
              <div className="z-10 flex shrink-0 items-center justify-between border-b border-border bg-surface p-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="eyebrow">Editorial Desk</p>

                    {/* Sync Indicator - Visible while background fetch runs */}
                    {isLoading && selectedPost && (
                      <span className="flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-primary animate-pulse border border-brand-primary/20">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Syncing Details
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                    {displayTitle}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Convert To Draft - Only for Scheduled Posts */}
                  {isScheduled && (
                    <>
                      <button
                        onClick={handleConvertToDraft}
                        className="btn btn-outline h-9 px-3 text-xs gap-2 hidden sm:flex"
                        title="Revert to Draft"
                      >
                        <FileDown className="h-4 w-4" />
                        <span>To Draft</span>
                      </button>
                      <div className="hidden sm:block h-6 w-px bg-border mx-1" />
                    </>
                  )}

                  {/* Delete Button - For ANY existing post (Draft or Scheduled) */}
                  {isExistingPost && onDelete && (
                    <>
                      <button
                        onClick={handleDeleteClick}
                        className="btn btn-outline h-9 px-3 text-xs gap-2 text-muted-foreground hover:text-error hover:bg-error/5 hover:border-error/20"
                        title="Delete Post"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                      <div className="h-6 w-px bg-border mx-1" />
                    </>
                  )}

                  <button
                    onClick={handleClose}
                    className="btn btn-icon hover:bg-surface-hover"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Editor Body */}
              <div className="flex-1 overflow-y-auto p-6 relative">
                {showBlockingSpinner ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                      <p className="text-sm text-muted-foreground">
                        Loading post data...
                      </p>
                    </div>
                  </div>
                ) : (
                  // Optimistic UI: Render Editor immediately.
                  // Background enrichment from usePostEditorWorkflow handles the rest.
                  <EditorialCore mode="editorial" onPostSuccess={handleClose} />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
