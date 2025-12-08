// components/post-editor/modals/publish-confirmation-modal.tsx

"use client";

import {
  X,
  Scissors,
  LucideIcon,
  CalendarClock,
  Rocket,
  Layers,
  MapPin,
  MessageCircle,
  Loader2,
  CheckCircle2,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PublishSummary {
  caption: string;
  captionLength: number;

  platforms: Array<{
    platformId: string;
    platformName: string;
    icon: LucideIcon;
    accounts: Array<{ id: string; name: string; avatarUrl: string }>;
  }>;

  media: {
    count: number;
    types: { images: number; videos: number };
    previews: Array<{ url: string; type: "image" | "video" }>;
  };

  timing: {
    isScheduled: boolean;
    displayText: string;
  };

  features?: {
    isThread?: boolean;
    threadLength?: number;
    hasLocation?: boolean;
    locationName?: string;
    hasFirstComment?: boolean;
    hasCollaborators?: boolean;
    collaboratorCount?: number;
    hasLabels?: boolean;
    labels?: string[];
    hasCustomThumbnail?: boolean;
    youtubePrivacy?: string;
  };
}

export type PublishStatus =
  | "idle"
  | "review"
  | "submitting"
  | "success"
  | "scheduled";

interface PublishConfirmationModalProps {
  isOpen: boolean;
  status: PublishStatus;
  onConfirm: () => void;
  onCancel: () => void;
  onCloseSuccess: () => void;
  summaryData: PublishSummary;
}

const getMediaCountText = (media: PublishSummary["media"]): string => {
  const { images, videos } = media.types;
  if (images > 0 && videos > 0) return "Mixed media composition";
  if (images > 0) return `${images} Image${images === 1 ? "" : "s"} attached`;
  if (videos > 0) return `${videos} Video${videos === 1 ? "" : "s"} attached`;
  return "Text-only post";
};

export default function PublishConfirmationModal({
  isOpen,
  status,
  onConfirm,
  onCancel,
  onCloseSuccess,
  summaryData,
}: PublishConfirmationModalProps) {
  if (!isOpen || status === "idle") return null;

  const { platforms, media, timing, features } = summaryData;

  // State Helpers
  const isSubmitting = status === "submitting";
  const isScheduled = status === "scheduled";
  const isSuccess = status === "success";
  const isFinished = isSuccess || isScheduled;

  // Dynamic Header Content
  const getHeaderContent = () => {
    if (isSubmitting)
      return {
        label: "System // Processing",
        title: "Deploying...",
      };
    if (isFinished)
      return {
        label: `Content // ${isScheduled ? "Scheduling" : "Distribution"}`,
        title: isScheduled ? "Confirmed" : "Deployed",
      };
    return {
      label: "System // Verification",
      title: "Final Check",
    };
  };

  const header = getHeaderContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#e5e5e0]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#fdfbf7] border border-black/10 shadow-2xl rounded-lg flex flex-col overflow-hidden max-h-[90vh] transition-all duration-300">
        {/* --- 1. HEADER --- */}
        <div className="p-8 border-b border-black/5 pb-6 bg-[#fdfbf7] shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {header.label}
              </p>
              <h2 className="headline text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                {header.title}
                {isSubmitting && (
                  <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                )}
              </h2>
            </div>
            {!isSubmitting && (
              <button
                onClick={isFinished ? onCloseSuccess : onCancel}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* --- 2. CONTENT BODY --- */}
        <div className="p-8 pt-6 overflow-y-auto custom-scrollbar">
          {isFinished ? (
            /* --- STATE: SUCCESS/SCHEDULED --- */
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div
                className={cn(
                  "p-6 border rounded-sm flex gap-4 items-start",
                  isScheduled
                    ? "bg-blue-50/50 border-blue-100"
                    : "bg-green-50/50 border-green-100"
                )}
              >
                <div
                  className={cn(
                    "p-3 rounded-full shrink-0 border",
                    isScheduled
                      ? "bg-blue-100/50 text-blue-700 border-blue-200"
                      : "bg-green-100/50 text-green-700 border-green-200"
                  )}
                >
                  {isScheduled ? (
                    <CalendarClock className="w-6 h-6" />
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-foreground text-xl">
                    {isScheduled
                      ? "Scheduled Successfully"
                      : "Published Successfully"}
                  </h3>
                  <p className="font-serif text-sm text-muted-foreground mt-2 leading-relaxed max-w-md">
                    {isScheduled
                      ? `Your post has been added to the queue and will be published automatically on ${timing.displayText.replace(
                          "Scheduled for ",
                          ""
                        )}.`
                      : `Your post is now live across ${platforms.length} platform(s). It may take a few moments to appear on feeds.`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* --- STATE: REVIEW / SUBMITTING --- */
            <div
              className={cn(
                "space-y-8 transition-opacity duration-300",
                isSubmitting ? "opacity-50 pointer-events-none grayscale" : ""
              )}
            >
              {/* Timing Badge */}
              <div
                className={cn(
                  "p-4 border rounded-sm flex gap-3 items-center",
                  timing.isScheduled
                    ? "bg-brand-primary/5 border-brand-primary/20"
                    : "bg-orange-50/50 border-orange-100"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-full h-fit shrink-0",
                    timing.isScheduled
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "bg-orange-100 text-orange-600"
                  )}
                >
                  {timing.isScheduled ? (
                    <CalendarClock className="w-5 h-5" />
                  ) : (
                    <Rocket className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {timing.isScheduled ? "Scheduled For" : "Action"}
                  </p>
                  <p className="font-serif text-lg font-bold text-foreground leading-tight">
                    {timing.displayText}
                  </p>
                </div>
              </div>

              {/* Platform Section */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1 flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Targets ({platforms.length})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {platforms.map((platform) => {
                    const PlatformIcon = platform.icon;
                    return (
                      <div
                        key={platform.platformId}
                        className="group flex items-center justify-between p-3 rounded-sm border border-black/10 bg-white/50 hover:bg-black/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-white border border-black/5 rounded-sm shadow-sm group-hover:border-black/20 transition-colors">
                            <PlatformIcon className="w-4 h-4 text-foreground/80" />
                          </div>
                          <span className="font-serif font-bold text-sm text-foreground">
                            {platform.platformName}
                          </span>
                        </div>

                        <div className="flex -space-x-2">
                          {platform.accounts.map((acc) => (
                            <div
                              key={acc.id}
                              className="relative w-6 h-6 rounded-full border border-[#fdfbf7] shadow-sm overflow-hidden"
                              title={acc.name}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={acc.avatarUrl}
                                alt={acc.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Media Section */}
              {media.count > 0 && (
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                    Media Assets
                  </label>
                  <div className="border border-black/10 rounded-sm p-3 bg-surface-hover">
                    <div className="flex items-center justify-between mb-3 border-b border-black/5 pb-2">
                      <span className="font-serif text-sm font-medium text-foreground">
                        {getMediaCountText(media)}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        Total: {media.count}
                      </span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                      {media.previews.map((preview, idx) => (
                        <div
                          key={idx}
                          className="w-16 h-16 rounded-[2px] overflow-hidden border border-black/10 shrink-0 shadow-sm"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview.url}
                            alt={`Media ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Features Recap */}
              {features &&
                (features.hasLocation || features.hasFirstComment) && (
                  <div className="flex gap-4 pt-2 border-t border-black/5">
                    {features.hasLocation && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <MapPin className="w-3 h-3" />
                        <span className="font-mono uppercase tracking-wide">
                          {features.locationName}
                        </span>
                      </div>
                    )}
                    {features.hasFirstComment && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <MessageCircle className="w-3 h-3" />
                        <span className="font-mono uppercase tracking-wide">
                          First Comment
                        </span>
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}

          {/* --- 3. SHARED FOOTER --- */}

          {/* Cut Line */}
          <div className="flex items-center gap-2 text-black/20 py-6">
            <Scissors className="h-4 w-4 -rotate-90" />
            <div className="flex-1 border-b-2 border-dashed border-black/10" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {isFinished ? (
              <button
                type="button"
                onClick={onCloseSuccess}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Return to Feed</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="btn btn-outline flex-1"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="btn btn-primary flex-[2]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : timing.isScheduled ? (
                    <>Schedule Post</>
                  ) : (
                    <>Publish Now</>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
