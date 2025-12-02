// components/calendar/views/week-view.tsx

"use client";

import { useMemo } from "react";
import {
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameHour,
  addHours,
  startOfDay,
} from "date-fns";
import { Plus, Clock } from "lucide-react";
import type { ScheduledPost } from "../types";
import { cn } from "@/lib/utils";
import PlatformIcon from "../components/platform-icon";

interface WeekViewProps {
  currentDate: Date;
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
  onNewPost: (date: Date) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function WeekView({
  currentDate,
  posts,
  onEditPost,
  onNewPost,
}: WeekViewProps) {
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  return (
    <div className="flex h-full min-h-[600px] overflow-hidden bg-surface rounded-lg border border-border">
      {/* Time Sidebar - Fixed */}
      <div className="w-16 flex-none border-r border-border bg-background overflow-y-auto scrollbar-hide z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <div className="sticky top-0 z-20 h-12 border-b border-border bg-background" />
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="flex h-28 items-start justify-center border-b border-border/50 py-2"
          >
            <span className="font-serif text-[10px] text-muted-foreground">
              {format(new Date().setHours(hour, 0, 0, 0), "h a")}
            </span>
          </div>
        ))}
      </div>

      {/* Days Grid - Scrollable */}
      <div className="flex flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[800px] md:min-w-[1000px] w-full">
          {weekDays.map((day) => {
            const isCurrentDay = isToday(day);
            const postsForDay = posts.filter((post) =>
              isSameDay(new Date(post.scheduledAt), day)
            );

            return (
              <div
                key={day.toString()}
                className={cn(
                  "flex-1 min-w-[120px] md:min-w-[140px] border-r border-border last:border-r-0 flex flex-col",
                  isCurrentDay ? "bg-surface" : "bg-background"
                )}
              >
                {/* Day Header */}
                <div
                  className={cn(
                    "sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border px-3 transition-colors",
                    isCurrentDay
                      ? "bg-brand-primary/5 border-b-brand-primary/20"
                      : "bg-surface-hover"
                  )}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg font-bold text-foreground">
                      {format(day, "d")}
                    </span>
                    <span className="eyebrow text-[10px]">
                      {format(day, "EEE")}
                    </span>
                  </div>

                  {isCurrentDay && (
                    <div className="h-2 w-2 rounded-full bg-brand-primary" />
                  )}
                </div>

                {/* Time Slots (Buckets) */}
                <div className="flex-1">
                  {HOURS.map((hour) => {
                    const slotDate = addHours(startOfDay(day), hour);

                    const postsForHour = postsForDay
                      .filter((post) =>
                        isSameHour(new Date(post.scheduledAt), slotDate)
                      )
                      .sort(
                        (a, b) =>
                          new Date(a.scheduledAt).getTime() -
                          new Date(b.scheduledAt).getTime()
                      );

                    return (
                      <div
                        key={hour}
                        className={cn(
                          "group relative min-h-[112px] border-b border-border/50 p-2 transition-colors hover:bg-muted/20 flex flex-col gap-2",
                          isCurrentDay && "bg-brand-primary/[0.02]"
                        )}
                      >
                        {/* Invisible Click Target for "New Post" */}
                        <div
                          className="absolute inset-0 z-0 cursor-pointer"
                          onClick={() => onNewPost(slotDate)}
                          title={`Add post at ${format(slotDate, "h:mm a")}`}
                        />

                        {/* Render Posts Stacked */}
                        {postsForHour.map((post) => {
                          const isSent = post.status === "sent";
                          const firstMedia = post.media?.[0];
                          const mediaUrl =
                            firstMedia?.thumbnailUrl || firstMedia?.url;

                          return (
                            <button
                              key={post.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditPost(post);
                              }}
                              className={cn(
                                "relative z-10 flex w-full items-center rounded-md border border-border bg-white text-left shadow-sm transition-all hover:border-brand-primary hover:shadow-md active:scale-[0.98]",
                                // Responsive padding and gap (2xl breakpoint)
                                "p-1.5 gap-2 2xl:p-2 2xl:gap-3",
                                isSent &&
                                  "opacity-75 bg-muted/30 border-muted-foreground/20 hover:border-muted-foreground/40"
                              )}
                            >
                              <div className="flex shrink-0 items-center justify-center rounded-full bg-muted/50 h-6 w-6 2xl:h-8 2xl:w-8">
                                <PlatformIcon
                                  platform={post.platform}
                                  className={cn(
                                    isSent
                                      ? "text-muted-foreground/70"
                                      : "text-muted-foreground",
                                    "w-3 h-3 2xl:w-4 2xl:h-4"
                                  )}
                                  size={16}
                                />
                              </div>

                              {mediaUrl && (
                                <div
                                  className={cn(
                                    "relative shrink-0 overflow-hidden rounded-md bg-muted border border-border/50",
                                    "h-6 w-6 2xl:h-8 2xl:w-8",
                                    isSent && "opacity-80 grayscale-[0.2]"
                                  )}
                                >
                                  <img
                                    src={mediaUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              )}

                              <div className="flex min-w-0 flex-1 flex-row items-center justify-between gap-2 2xl:flex-col 2xl:justify-center 2xl:gap-0.5 2xl:items-start">
                                <span
                                  className={cn(
                                    "truncate font-medium text-foreground leading-tight text-xs",
                                    isSent && "text-muted-foreground"
                                  )}
                                >
                                  {post.content || "Untitled"}
                                </span>
                                <span className="font-serif text-[9px] 2xl:text-[10px] font-bold text-muted-foreground shrink-0 leading-none">
                                  {format(new Date(post.scheduledAt), "h:mm a")}
                                </span>
                              </div>
                            </button>
                          );
                        })}

                        {/* Hover Add Button */}
                        <div className="absolute right-1 bottom-1 z-0 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                          <Plus className="h-3 w-3 text-muted-foreground/30" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
