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
import { Twitter, Instagram, Linkedin, Clock, Plus } from "lucide-react";
import type { ScheduledPost } from "../types";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  currentDate: Date;
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
  onNewPost: (date: Date) => void;
}

const platformIcons: Record<string, React.ElementType> = {
  x: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

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
    <div className="flex h-full min-h-[600px] overflow-hidden bg-surface">
      <div className="w-16 flex-none border-r border-border bg-background overflow-y-auto scrollbar-hide">
        <div className="sticky top-0 z-20 h-12 border-b border-border bg-background" />{" "}
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

      <div className="flex flex-1 overflow-x-auto overflow-y-auto">
        <div className="flex min-w-[800px] w-full">
          {weekDays.map((day) => {
            const isCurrentDay = isToday(day);
            const postsForDay = posts.filter((post) =>
              isSameDay(new Date(post.scheduledAt), day)
            );

            return (
              <div
                key={day.toString()}
                className={cn(
                  "flex-1 min-w-[140px] border-r border-border last:border-r-0 flex flex-col",
                  isCurrentDay ? "bg-surface" : "bg-background"
                )}
              >
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
                          "group relative min-h-[112px] border-b border-border/50 p-1 transition-colors hover:bg-muted/20 flex flex-col gap-1",
                          isCurrentDay && "bg-brand-primary/[0.02]"
                        )}
                      >
                        <div
                          className="absolute inset-0 z-0 cursor-pointer"
                          onClick={() => onNewPost(slotDate)}
                          title={`Add post at ${format(slotDate, "h:mm a")}`}
                        />

                        {postsForHour.map((post) => {
                          const Icon = platformIcons[post.platform] || Clock;
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
                                "relative z-10 flex w-full flex-col gap-1.5 rounded-sm border border-border bg-white p-1.5 text-left shadow-sm transition-all hover:border-brand-primary hover:shadow-md active:scale-[0.98]",
                                isSent && "opacity-60 bg-muted/50"
                              )}
                            >
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <Icon
                                  className={cn(
                                    "h-3 w-3",
                                    !isSent && "text-brand-primary"
                                  )}
                                />
                                {mediaUrl && (
                                  <div className="relative shrink-0 overflow-hidden rounded-sm bg-muted h-4 w-4 border border-border/50">
                                    <img
                                      src={mediaUrl}
                                      alt=""
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                    />
                                  </div>
                                )}
                                <span className="font-serif font-bold">
                                  {format(new Date(post.scheduledAt), "h:mm a")}
                                </span>
                              </div>
                              <span className="w-full truncate text-xs font-medium text-foreground">
                                {post.content || "Untitled"}
                              </span>
                            </button>
                          );
                        })}

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
