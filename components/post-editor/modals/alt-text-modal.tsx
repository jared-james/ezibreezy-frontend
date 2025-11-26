// components/post-editor/modals/alt-text-modal.tsx

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { X, Save, FileText, Info, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MediaItem, useEditorialStore } from "@/lib/store/editorial-store";
import { useUpdateMedia } from "@/lib/hooks/use-media";
import { toast } from "sonner";

interface AltTextModalProps {
  open: boolean;
  onClose: () => void;
  mediaItems: MediaItem[];
  initialMediaIndex: number;
}

export function AltTextModal({
  open,
  onClose,
  mediaItems,
  initialMediaIndex,
}: AltTextModalProps) {
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleCloseAttempt = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowCloseConfirmation(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  const handleConfirmClose = useCallback(() => {
    setShowCloseConfirmation(false);
    onClose();
  }, [onClose]);

  const handleCancelClose = useCallback(() => {
    setShowCloseConfirmation(false);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseAttempt();
      }
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, handleCloseAttempt]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <AltTextModalContent
        onClose={handleCloseAttempt}
        mediaItems={mediaItems}
        initialMediaIndex={initialMediaIndex}
        onUnsavedChangesUpdate={setHasUnsavedChanges}
      />

      {/* Close Confirmation Dialog */}
      {showCloseConfirmation && (
        <DiscardDialog
          onDiscard={handleConfirmClose}
          onCancel={handleCancelClose}
          message="You have unsaved changes. Do you want to close without saving?"
        />
      )}
    </>
  );
}

interface AltTextModalContentProps {
  onClose: () => void;
  mediaItems: MediaItem[];
  initialMediaIndex: number;
  onUnsavedChangesUpdate: (hasChanges: boolean) => void;
}

function AltTextModalContent({
  onClose,
  mediaItems,
  initialMediaIndex,
  onUnsavedChangesUpdate,
}: AltTextModalContentProps) {
  const CHARACTER_LIMIT = 125; // Instagram limit

  // Get integration ID and store setter from selected accounts
  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const setStagedMediaItems = useEditorialStore((state) => state.setStagedMediaItems);
  const stagedMediaItems = useEditorialStore((state) => state.stagedMediaItems);

  const integrationId = useMemo(() => {
    const allIds = Object.values(selectedAccounts).flat();
    return allIds[0] || null;
  }, [selectedAccounts]);

  // Local state
  const [currentMediaIndex, setCurrentMediaIndex] = useState(initialMediaIndex);
  const [localAltTexts, setLocalAltTexts] = useState<Record<string, string>>({});
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingMediaIndex, setPendingMediaIndex] = useState<number | null>(null);

  // Initialize local alt texts from media items
  const initialTexts = useMemo(() => {
    const texts: Record<string, string> = {};
    mediaItems.forEach((item) => {
      if (item.id) {
        texts[item.id] = item.altText || "";
      }
    });
    return texts;
  }, [mediaItems]);

  useEffect(() => {
    setLocalAltTexts(initialTexts);
  }, [initialTexts]);

  // API hook
  const updateMediaMutation = useUpdateMedia(integrationId);

  // Current media item
  const currentMedia = mediaItems[currentMediaIndex];
  const currentId = currentMedia?.id;
  const currentAltText = currentId ? localAltTexts[currentId] ?? "" : "";

  // Detect unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!currentId) return false;
    const localText = localAltTexts[currentId] ?? "";
    const savedText = currentMedia?.altText ?? "";
    return localText !== savedText;
  }, [currentId, localAltTexts, currentMedia?.altText]);

  // Notify parent of unsaved changes
  useEffect(() => {
    onUnsavedChangesUpdate(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesUpdate]);

  // Character count validation
  const characterCount = currentAltText.length;
  const isOverLimit = characterCount > CHARACTER_LIMIT;
  const canSave = !!currentId && hasUnsavedChanges && !isOverLimit && !updateMediaMutation.isPending;

  // Handle alt text change
  const handleAltTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!currentId) return;
    setLocalAltTexts((prev) => ({
      ...prev,
      [currentId]: e.target.value,
    }));
  };

  // Handle save
  const handleSave = async () => {
    if (!currentId || !integrationId) {
      toast.error("Cannot save alt text at this time");
      return;
    }

    try {
      await updateMediaMutation.mutateAsync({
        id: currentId,
        data: { altText: currentAltText },
      });

      // Update the MediaItem in the editorial store
      const updatedItems = stagedMediaItems.map((item) =>
        item.id === currentId
          ? { ...item, altText: currentAltText }
          : item
      );
      setStagedMediaItems(updatedItems);

      // Sync local state with saved state
      setLocalAltTexts((prev) => ({
        ...prev,
        [currentId]: currentAltText,
      }));
    } catch (error) {
      // Error handling is done by mutation hook
      console.error("Failed to save alt text:", error);
    }
  };

  // Handle thumbnail click
  const handleThumbnailClick = (newIndex: number) => {
    if (updateMediaMutation.isPending) {
      toast.warning("Please wait for current save to complete");
      return;
    }

    if (hasUnsavedChanges) {
      setPendingMediaIndex(newIndex);
      setShowDiscardDialog(true);
    } else {
      setCurrentMediaIndex(newIndex);
    }
  };

  // Handle discard confirmation
  const handleDiscard = () => {
    if (pendingMediaIndex !== null) {
      // Reset local state to saved state
      if (currentId) {
        setLocalAltTexts((prev) => ({
          ...prev,
          [currentId]: currentMedia?.altText ?? "",
        }));
      }
      setCurrentMediaIndex(pendingMediaIndex);
    }
    setShowDiscardDialog(false);
    setPendingMediaIndex(null);
  };

  const handleCancelDiscard = () => {
    setShowDiscardDialog(false);
    setPendingMediaIndex(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-[1300px] h-[85vh] bg-background rounded-lg shadow-2xl flex overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Sidebar */}
          <div className="w-[320px] bg-muted/30 flex flex-col border-r border-border">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-lg">Alt Text Editor</h2>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="p-4 border-b border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Select image to edit
              </p>
              <div className={cn(
                "flex gap-2 overflow-x-auto pb-2",
                updateMediaMutation.isPending && "pointer-events-none opacity-50"
              )}>
                {mediaItems.map((media, index) => (
                  <ThumbnailItem
                    key={media.uid}
                    media={media}
                    isSelected={index === currentMediaIndex}
                    hasAltText={!!(media.altText && media.altText.trim().length > 0)}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
              </div>
            </div>

            {/* Alt Text Input */}
            <div className="flex-1 flex flex-col p-4 overflow-y-auto">
              <label className="text-sm font-medium mb-2">
                Alt Text
              </label>
              <textarea
                value={currentAltText}
                onChange={handleAltTextChange}
                placeholder="Describe this image..."
                className="flex-1 min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                disabled={!currentId || updateMediaMutation.isPending}
              />

              {/* Character Count */}
              <div className={cn(
                "text-xs mt-2 text-right",
                isOverLimit ? "text-red-600 font-medium" : "text-muted-foreground"
              )}>
                {characterCount}/{CHARACTER_LIMIT}
              </div>

              {/* Warning Message */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-sm">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800 leading-relaxed">
                    <strong>Note:</strong> Alt text is saved to the master media asset.
                    Changes will apply to all posts using this image, including published posts.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-border flex gap-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!canSave}
                variant="default"
                className="flex-1"
              >
                {updateMediaMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Preview Area */}
          <div className="flex-1 bg-neutral-900 flex items-center justify-center p-8">
            {currentMedia?.preview ? (
              <img
                src={currentMedia.preview}
                alt="Preview"
                className="max-h-full max-w-full object-contain rounded-sm"
              />
            ) : (
              <div className="text-white/60 text-sm">No preview available</div>
            )}
          </div>
        </div>
      </div>

      {/* Discard Changes Dialog */}
      {showDiscardDialog && (
        <DiscardDialog
          onDiscard={handleDiscard}
          onCancel={handleCancelDiscard}
        />
      )}
    </>
  );
}

interface ThumbnailItemProps {
  media: MediaItem;
  isSelected: boolean;
  hasAltText: boolean;
  onClick: () => void;
}

function ThumbnailItem({ media, isSelected, hasAltText, onClick }: ThumbnailItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-[60px] h-[60px] rounded-sm overflow-hidden shrink-0 transition-all",
        isSelected
          ? "border-2 border-brand-primary ring-2 ring-brand-primary/20"
          : "border border-border opacity-60 hover:opacity-100"
      )}
    >
      <img
        src={media.preview}
        alt=""
        className="w-full h-full object-cover"
      />

      {/* Status Badge */}
      <div className="absolute top-1 right-1">
        {hasAltText ? (
          <div className="bg-green-500 rounded-full p-0.5">
            <Check className="h-3 w-3 text-white" />
          </div>
        ) : (
          <div className="bg-gray-400 rounded-full p-0.5">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}

interface DiscardDialogProps {
  onDiscard: () => void;
  onCancel: () => void;
  message?: string;
}

function DiscardDialog({ onDiscard, onCancel, message }: DiscardDialogProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-background rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Discard changes?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          {message || "You have unsaved changes. Do you want to discard them?"}
        </p>
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={onDiscard} variant="destructive">
            Discard
          </Button>
        </div>
      </div>
    </div>
  );
}
