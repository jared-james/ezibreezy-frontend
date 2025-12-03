// components/post-editor/modals/alt-text-modal.tsx

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { X, Save, Info, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MediaItem,
  useEditorialDraftStore,
} from "@/lib/store/editorial/draft-store";
import { useUpdateMedia } from "@/lib/hooks/use-media";
import { toast } from "sonner";
import { useClientData } from "@/lib/hooks/use-client-data";

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

  // Keyboard trap for Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseAttempt();
      }
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, handleCloseAttempt]);

  // Lock scroll
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

      {showCloseConfirmation && (
        <DiscardDialog
          onDiscard={handleConfirmClose}
          onCancel={handleCancelClose}
          message="Unsaved edits detected. Close editor without saving?"
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
  const CHARACTER_LIMIT = 125;

  // Use Atomic Selectors for stability
  const stagedMediaItems = useEditorialDraftStore(
    (state) => state.stagedMediaItems
  );
  const setStagedMediaItems = useEditorialDraftStore(
    (state) => state.setStagedMediaItems
  );

  const [currentMediaIndex, setCurrentMediaIndex] = useState(initialMediaIndex);
  const [localAltTexts, setLocalAltTexts] = useState<Record<string, string>>(
    {}
  );
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingMediaIndex, setPendingMediaIndex] = useState<number | null>(
    null
  );

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

  const updateMediaMutation = useUpdateMedia();

  const currentMedia = mediaItems[currentMediaIndex];
  const currentId = currentMedia?.id;
  const currentAltText = currentId ? localAltTexts[currentId] ?? "" : "";

  const hasUnsavedChanges = useMemo(() => {
    if (!currentId) return false;
    const localText = localAltTexts[currentId] ?? "";
    const savedText = currentMedia?.altText ?? "";
    return localText !== savedText;
  }, [currentId, localAltTexts, currentMedia?.altText]);

  useEffect(() => {
    onUnsavedChangesUpdate(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesUpdate]);

  const characterCount = currentAltText.length;
  const isOverLimit = characterCount > CHARACTER_LIMIT;
  const canSave =
    !!currentId &&
    hasUnsavedChanges &&
    !isOverLimit &&
    !updateMediaMutation.isPending;

  const handleAltTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!currentId) return;
    setLocalAltTexts((prev) => ({
      ...prev,
      [currentId]: e.target.value,
    }));
  };

  const handleSave = async () => {
    if (!currentId) {
      toast.error("Cannot save alt text at this time");
      return;
    }

    try {
      await updateMediaMutation.mutateAsync({
        id: currentId,
        data: { altText: currentAltText },
      });

      // Update the main store
      const updatedItems = stagedMediaItems.map((item) =>
        item.id === currentId ? { ...item, altText: currentAltText } : item
      );
      setStagedMediaItems(updatedItems);

      setLocalAltTexts((prev) => ({
        ...prev,
        [currentId]: currentAltText,
      }));
      toast.success("Description saved to asset.");
    } catch (error) {
      console.error("Failed to save alt text:", error);
    }
  };

  const handleThumbnailClick = (newIndex: number) => {
    if (updateMediaMutation.isPending) return;

    if (hasUnsavedChanges) {
      setPendingMediaIndex(newIndex);
      setShowDiscardDialog(true);
    } else {
      setCurrentMediaIndex(newIndex);
    }
  };

  const handleDiscard = () => {
    if (pendingMediaIndex !== null) {
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
        className="fixed inset-0 bg-[#e5e5e0]/80 backdrop-grayscale z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="
            relative w-full max-w-[800px] h-[90vh] flex flex-col pointer-events-auto
            bg-[#fdfbf7] 
            border-[3px] border-black 
            shadow-[12px_12px_0_0_rgba(0,0,0,1)] 
            rounded-none
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Header Section */}
          <div className="shrink-0 px-6 py-4 bg-surface border-b-[3px] border-double border-black flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-serif text-[10px] uppercase tracking-[0.2em] text-foreground/70 mb-1">
                Editorial Access • Vol. 1
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-black uppercase">
                Alt Text Editor
              </h2>
            </div>
            <button
              onClick={onClose}
              className="
                group relative px-2 py-1 
                border-2 border-transparent hover:border-black 
                transition-all active:translate-y-0.5
              "
            >
              <X className="h-6 w-6 text-black" />
            </button>
          </div>

          {/* 2. Top Bar: Thumbnails */}
          <div className="shrink-0 bg-[#f4f4f0] border-b-2 border-dotted border-black/40 p-4">
            <div
              className={cn(
                "flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide",
                updateMediaMutation.isPending &&
                  "pointer-events-none opacity-50"
              )}
            >
              {mediaItems.map((media, index) => (
                <ThumbnailItem
                  key={media.uid}
                  media={media}
                  isSelected={index === currentMediaIndex}
                  hasAltText={
                    !!(media.altText && media.altText.trim().length > 0)
                  }
                  index={index}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </div>

          {/* 3. Middle: Preview Area */}
          <div className="flex-1 min-h-0 bg-[#fdfbf7] relative p-8 flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(#000 1px, transparent 1px)",
                backgroundSize: "100% 40px",
              }}
            />

            {currentMedia?.preview ? (
              <div className="relative group max-h-full max-w-full z-10">
                <div className="relative border-4 border-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] bg-white p-2 transform rotate-1 transition-transform duration-500 group-hover:rotate-0">
                  <img
                    src={currentMedia.preview}
                    alt="Preview"
                    className="max-h-[50vh] object-contain border border-black/10"
                  />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#e2e2d0]/80 rotate-[-2deg] opacity-80 backdrop-blur-[1px] shadow-sm z-20" />
              </div>
            ) : (
              <div className="text-black/40 font-serif italic text-xl border-2 border-dashed border-black/20 p-8">
                No Preview Available
              </div>
            )}
          </div>

          {/* 4. Bottom: Alt Text Input */}
          <div className="shrink-0 bg-surface border-t-[3px] border-black p-0 flex flex-col">
            <div className="flex items-center justify-between px-6 py-2 bg-[#f4f4f0] border-b border-black">
              <label className="font-serif text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-black rounded-full" />
                Image Description
              </label>

              <div
                className={cn(
                  "font-mono text-xs px-2 py-0.5 border border-black/20 bg-white",
                  isOverLimit
                    ? "text-red-600 font-bold border-red-200"
                    : "text-black/60"
                )}
              >
                CHARS: {characterCount} / {CHARACTER_LIMIT}
              </div>
            </div>

            <div className="flex h-full min-h-[160px]">
              <div className="flex-1 relative">
                <textarea
                  value={currentAltText}
                  onChange={handleAltTextChange}
                  placeholder="Type description here..."
                  className="
                    w-full h-full p-6 
                    bg-transparent 
                    font-mono text-base leading-relaxed text-black
                    placeholder:text-black/30 placeholder:italic
                    border-none focus:ring-0 resize-none
                  "
                  disabled={!currentId || updateMediaMutation.isPending}
                />
              </div>

              <div className="w-[200px] border-l border-black p-4 flex flex-col justify-between bg-[#fdfbf7]">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 text-black/60 shrink-0" />
                  <p className="font-serif text-[10px] leading-tight text-muted-foreground">
                    Text saves to the master asset. Updates apply to all
                    instances.
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={onClose}
                    className="w-full py-2 font-serif text-xs uppercase tracking-widest border border-black/20 hover:bg-black/5 hover:border-black transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={!canSave}
                    className="
                        w-full py-2 
                        bg-black text-white 
                        font-serif text-xs uppercase tracking-widest font-bold
                        border border-black
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-brand-primary transition-colors
                        flex items-center justify-center gap-2
                      "
                  >
                    {updateMediaMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        SAVE <Save className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
  index: number;
  onClick: () => void;
}

function ThumbnailItem({
  media,
  isSelected,
  hasAltText,
  index,
  onClick,
}: ThumbnailItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 group">
      <button
        onClick={onClick}
        className={cn(
          "relative w-14 h-14 overflow-hidden transition-all duration-200 border-2",
          isSelected
            ? "border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] -translate-y-1"
            : "border-black/20 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 hover:border-black"
        )}
      >
        <img
          src={media.preview}
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute top-0 right-0 p-0.5 bg-white border-b border-l border-black/20 z-10">
          {hasAltText ? (
            <div className="w-2 h-2 bg-green-600 rounded-full" />
          ) : (
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          )}
        </div>
      </button>
      <span
        className={cn(
          "font-mono text-[10px] text-black/50 transition-colors",
          isSelected && "text-black font-bold"
        )}
      >
        IMG_{String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

interface DiscardDialogProps {
  onDiscard: () => void;
  onCancel: () => void;
  message?: string;
}

function DiscardDialog({ onDiscard, onCancel, message }: DiscardDialogProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/10 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div
        className="
        relative bg-white 
        border-[3px] border-black 
        shadow-[8px_8px_0_0_#ef4444] 
        p-8 max-w-sm w-full text-center
      "
      >
        <div className="mx-auto w-12 h-12 flex items-center justify-center mb-4 border-2 border-black rounded-full bg-red-50 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>

        <h3 className="font-serif text-xl font-bold mb-2 uppercase tracking-wide">
          Warning
        </h3>
        <p className="font-serif text-sm text-black/70 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 border-2 border-black hover:bg-black/5 font-mono text-xs uppercase"
          >
            Go Back
          </button>
          <button
            onClick={onDiscard}
            className="flex-1 py-2 px-4 bg-red-600 text-white border-2 border-red-600 hover:bg-red-700 font-mono text-xs uppercase"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
