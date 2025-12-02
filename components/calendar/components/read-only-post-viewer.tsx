// components/calendar/components/read-only-post-viewer.tsx

"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Copy,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import type { ScheduledPost } from "../types";
import PlatformIcon from "./platform-icon";
import { cn } from "@/lib/utils";

interface ReadOnlyPostViewerProps {
  post: ScheduledPost;
  onReuse: () => void;
  onClose: () => void;
}

export default function ReadOnlyPostViewer({
  post,
  onReuse,
  onClose,
}: ReadOnlyPostViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const mediaItems = post.media || [];
  const hasMedia = mediaItems.length > 0;
  const isMultiple = mediaItems.length > 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header / Info Bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface-hover/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
            <CheckCircle2 className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-sm font-bold text-foreground">
                Published Post
              </h3>
              <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                Sent
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Posted to <span className="capitalize">{post.platform}</span> on{" "}
              {format(new Date(post.scheduledAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area - Content Left, Media Right */}
      <div className="flex flex-1 flex-col-reverse gap-8 overflow-y-auto p-6 md:flex-row">
        {/* LEFT COLUMN: Content & Metadata */}
        <div className="flex flex-1 flex-col gap-6">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
                <PlatformIcon
                  platform={post.platform}
                  size={16}
                  className="text-foreground"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  @{post.platformUsername}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {post.platform}
                </p>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {post.content}
              </p>
            </div>
          </div>

          {/* Analytics Placeholder */}
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-bold text-foreground">
                Performance
              </h4>
              <span className="text-[10px] text-muted-foreground">
                Last updated just now
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Mock Analytics Cards */}
              {["Impressions", "Likes", "Comments"].map((metric) => (
                <div
                  key={metric}
                  className="rounded-md border border-border bg-background p-3 text-center"
                >
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {metric}
                  </p>
                  <p className="font-serif text-xl font-bold text-foreground">
                    -
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground/70 mt-2">
              Analytics data not yet available for this period.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Media Carousel */}
        <div className="flex-1 md:max-w-[45%]">
          {hasMedia ? (
            <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-black shadow-md">
              {/* Main Media Display */}
              <div className="relative h-full w-full">
                {mediaItems.map((item, index) => {
                  const isVideo = item.type.startsWith("video");
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "absolute inset-0 h-full w-full transition-opacity duration-300",
                        index === currentSlide
                          ? "opacity-100 z-10"
                          : "opacity-0 z-0 pointer-events-none"
                      )}
                    >
                      {isVideo ? (
                        <div className="relative h-full w-full flex items-center justify-center bg-gray-900">
                          <video
                            src={item.url}
                            poster={item.thumbnailUrl || undefined}
                            controls
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={`Slide ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Arrows */}
              {isMultiple && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/70 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/70 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {isMultiple && (
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                  {mediaItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all shadow-sm",
                        idx === currentSlide
                          ? "w-4 bg-white"
                          : "w-1.5 bg-white/50 hover:bg-white/80"
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Media Counter Badge */}
              {isMultiple && (
                <div className="absolute top-4 right-4 z-20 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                  {currentSlide + 1} / {mediaItems.length}
                </div>
              )}
            </div>
          ) : (
            /* Empty State for Text-only Posts */
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-xl border border-border border-dashed bg-surface p-8 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <PlatformIcon
                  platform={post.platform}
                  size={32}
                  className="text-muted-foreground/50"
                />
              </div>
              <p className="font-medium text-muted-foreground">
                Text-only post
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                No media attachments found for this post.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-border bg-surface px-6 py-4">
        <button
          onClick={onClose}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
        >
          Close
        </button>
        <button
          onClick={onReuse}
          className="btn btn-primary flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Copy className="h-4 w-4" />
          <span>Reuse as New Draft</span>
        </button>
      </div>
    </div>
  );
}
