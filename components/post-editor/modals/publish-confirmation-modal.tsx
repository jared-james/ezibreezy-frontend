// components/post-editor/modals/publish-confirmation-modal.tsx

"use client";

import { Button } from "@/components/ui/button";
import { X, MapPin, MessageCircle, Users, Tag, Image as ImageIcon, MessageSquare, LucideIcon } from "lucide-react";

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

interface PublishConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  summaryData: PublishSummary;
}

const getMediaCountText = (media: PublishSummary["media"]): string => {
  const { images, videos } = media.types;

  if (images > 0 && videos > 0) return "Mixed media magic ✨";

  if (images > 0) {
    const adjectives = ["stunning", "gorgeous", "beautiful", "captivating"];
    const adj = adjectives[images % adjectives.length];
    return `${images} ${adj} ${images === 1 ? "image" : "images"}`;
  }

  if (videos > 0) {
    const adjectives = ["amazing", "engaging", "dynamic", "compelling"];
    const adj = adjectives[videos % adjectives.length];
    return `${videos} ${adj} ${videos === 1 ? "video" : "videos"}`;
  }

  return "Text-only post";
};

export default function PublishConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  summaryData,
}: PublishConfirmationModalProps) {
  if (!isOpen) return null;

  const { caption, captionLength, platforms, media, timing, features } = summaryData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-surface border border-foreground shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <p className="eyebrow mb-2">FINAL LOOK</p>
            <div className="border-b border-foreground mb-4 mx-auto w-16" />
            <h2 className="font-serif text-4xl font-bold uppercase tracking-tight">
              Ready to Publish?
            </h2>
          </div>

          {/* Double rule */}
          <div className="border-b-4 border-double border-foreground" />

          {/* Caption Section */}
          {caption && (
            <div>
              <p className="eyebrow mb-3">YOUR MESSAGE</p>
              <div className="bg-surface-hover border border-border rounded-lg p-4">
                <p className="font-serif text-sm text-foreground leading-relaxed line-clamp-4">
                  {caption}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {captionLength} characters
                </p>
              </div>
            </div>
          )}

          {/* Platform Section */}
          <div>
            <p className="eyebrow mb-3">PUBLISHING TO</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {platforms.map((platform) => {
                const PlatformIcon = platform.icon;
                return (
                  <div
                    key={platform.platformId}
                    className="border border-border rounded-lg p-3 bg-surface-hover"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <PlatformIcon className="w-4 h-4" />
                      <span className="font-serif font-bold text-sm">
                        {platform.platformName}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {platform.accounts.map((acc) => (
                        <div
                          key={acc.id}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={acc.avatarUrl}
                            alt={acc.name}
                            className="w-4 h-4 rounded-full"
                          />
                          <span>{acc.name}</span>
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
            <div>
              <p className="eyebrow mb-3">MEDIA ATTACHED</p>
              <div className="flex items-start gap-3 flex-wrap">
                <div className="bg-brand-primary text-brand-primary-foreground rounded-full px-4 py-2 font-serif font-bold text-sm whitespace-nowrap">
                  {getMediaCountText(media)}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {media.previews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 rounded overflow-hidden border border-border shrink-0"
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

          {/* Timing Badge */}
          <div className="bg-linear-to-r from-brand-primary/10 to-transparent border-l-4 border-brand-primary p-4 rounded">
            <p className="font-serif font-bold text-lg">
              {timing.displayText}
            </p>
          </div>

          {/* Features List (conditional) */}
          {features && Object.keys(features).length > 0 && (
            <div>
              <p className="eyebrow mb-3">SPECIAL FEATURES</p>
              <ul className="space-y-2 text-sm font-serif">
                {features.isThread && features.threadLength && (
                  <li className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span>Thread with {features.threadLength} messages</span>
                  </li>
                )}
                {features.hasLocation && features.locationName && (
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{features.locationName}</span>
                  </li>
                )}
                {features.hasFirstComment && (
                  <li className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span>First comment queued</span>
                  </li>
                )}
                {features.hasCollaborators && features.collaboratorCount && (
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {features.collaboratorCount}{" "}
                      {features.collaboratorCount === 1 ? "collaborator" : "collaborators"}
                    </span>
                  </li>
                )}
                {features.hasLabels && features.labels && features.labels.length > 0 && (
                  <li className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span>{features.labels.join(", ")}</span>
                  </li>
                )}
                {features.hasCustomThumbnail && (
                  <li className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <span>Custom thumbnail</span>
                  </li>
                )}
                {features.youtubePrivacy && (
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">🔒</span>
                    <span>Privacy: {features.youtubePrivacy}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Double rule */}
          <div className="border-b-4 border-double border-foreground" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 font-serif"
            >
              Wait, Go Back
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              className="flex-1 font-serif"
            >
              Let&apos;s Go! 🚀
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
