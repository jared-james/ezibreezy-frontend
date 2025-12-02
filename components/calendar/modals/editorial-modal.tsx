// components/calendar/modals/editorial-modal.tsx

"use client";

import { useState } from "react";
import { X, Loader2, Trash2, FileDown } from "lucide-react";
import { useEditorialDraftStore } from "@/lib/store/editorial/draft-store";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";
import { useEditorialUIStore } from "@/lib/store/editorial/ui-store";
import EditorialCore from "@/components/post-editor";
import ReadOnlyPostViewer from "../components/read-only-post-viewer";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import type { ScheduledPost } from "../types";
import { toast } from "sonner";

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
  title = "Create New Post",
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

  if (!isOpen) return null;

  const isSent = selectedPost?.status === "sent";
  const isScheduled = selectedPost?.status === "scheduled";
  // Check if we are editing an existing post (not creating a new one)
  const isExistingPost = !!selectedPost;

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
                  <p className="eyebrow mb-1">Editorial Desk</p>
                  <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                    {title}
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
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                      <p className="text-sm text-muted-foreground">
                        Loading post data...
                      </p>
                    </div>
                  </div>
                ) : (
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
