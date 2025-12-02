// components/calendar/components/read-only-post-viewer.tsx

"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Copy,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
} from "lucide-react";
import type { ScheduledPost } from "../types";
import PlatformIcon from "./platform-icon";
import { cn } from "@/lib/utils";

interface ReadOnlyPostViewerProps {
  post: ScheduledPost;
  onReuse: () => void;
  onClose: () => void;
  onDelete?: () => void;
}

export default function ReadOnlyPostViewer({
  post,
  onReuse,
  onClose,
  onDelete,
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
    <div className="flex h-full flex-col bg-surface">
      <div className="flex items-center justify-between border-b border-border p-6 bg-surface">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success border border-success/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="headline text-2xl">Published</h2>
              <span className="inline-flex items-center rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-success">
                Sent
              </span>
            </div>
            <p className="font-serif text-sm text-muted-foreground mt-1">
              Posted on{" "}
              {format(new Date(post.scheduledAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={onDelete}
              className="btn btn-outline h-9 px-3 text-xs gap-2 text-muted-foreground hover:text-error hover:bg-error/5 hover:border-error/20"
              title="Delete from History"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
          <div className="h-6 w-px bg-border mx-1" />
          <button
            onClick={onClose}
            className="btn btn-icon hover:bg-surface-hover"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col-reverse gap-8 overflow-y-auto p-6 md:flex-row bg-[#fdfbf7]">
        <div className="flex flex-1 flex-col gap-6">
          <div className="card bg-white shadow-sm border-border">
            <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border">
                <PlatformIcon
                  platform={post.platform}
                  size={20}
                  className="text-foreground"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">
                  @{post.platformUsername}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  {post.platform}
                </p>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 font-serif">
                {post.content}
              </p>
            </div>
          </div>

          <div className="card bg-white shadow-sm border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-serif text-lg font-bold text-foreground">
                Performance
              </h4>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider bg-muted px-2 py-1 rounded-sm">
                Live Data
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {["Impressions", "Likes", "Comments"].map((metric) => (
                <div
                  key={metric}
                  className="rounded-lg border border-border bg-surface p-4 text-center"
                >
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">
                    {metric}
                  </p>
                  <p className="font-serif text-2xl font-bold text-foreground">
                    -
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground/70 mt-6 font-serif italic">
              Analytics data connection pending.
            </p>
          </div>
        </div>

        <div className="flex-1 md:max-w-[45%]">
          {hasMedia ? (
            <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-black shadow-lg">
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

              {isMultiple && (
                <div className="absolute top-4 right-4 z-20 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm border border-white/10">
                  {currentSlide + 1} / {mediaItems.length}
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-white/50 p-8 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <PlatformIcon
                  platform={post.platform}
                  size={32}
                  className="text-muted-foreground/50"
                />
              </div>
              <p className="font-serif font-bold text-muted-foreground">
                Text-only post
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border bg-surface px-6 py-4">
        <button onClick={onClose} className="btn btn-outline">
          Close
        </button>
        <button onClick={onReuse} className="btn btn-primary gap-2">
          <Copy className="h-4 w-4" />
          <span>Reuse as New Draft</span>
        </button>
      </div>
    </div>
  );
}
