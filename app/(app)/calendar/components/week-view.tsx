// app/(app)/calendar/components/week-view.tsx

"use client";

import { useMemo } from "react";
import {
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  getHours,
  getMinutes,
} from "date-fns";
import { Twitter, Instagram, Linkedin, Clock, Plus } from "lucide-react";
import type { ScheduledPost } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

// Larger time slots for better visibility
const TIME_SLOT_HEIGHT_PX = 120; // h-30 = 120px (much bigger view)
const TIME_SLOT_COUNT = 24; // 24 hours (00:00 to 23:00)

const timeSlots = Array.from(
  { length: TIME_SLOT_COUNT },
  (_, i) => `${String(i).padStart(2, "0")}:00`
);
// --------------------------------------------------------------------------------------

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
    <div className="border border-[--border] bg-[--surface] flex">
      <div className="w-20 shrink-0 border-r border-[--border]">
        <div className="h-16 border-b border-[--border]"></div>
        {timeSlots.map((time) => (
          <div
            key={time}
            className="border-b border-[--border] relative"
            style={{ height: `${TIME_SLOT_HEIGHT_PX}px` }}
          >
            <span className="absolute -top-2.5 right-2 text-right font-serif text-sm text-[--muted-foreground] bg-[--surface] px-1.5">
              {format(new Date(`1970-01-01T${time}`), "h a")}
            </span>
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7">
        {weekDays.map((day, dayIndex) => {
          const isToday = isSameDay(day, new Date());
          const postsForDay = posts.filter((post) =>
            isSameDay(new Date(post.scheduledAt), day)
          );

          return (
            <div
              key={day.toString()}
              className={cn(
                "border-r border-[--border]",
                dayIndex === 6 && "border-r-0"
              )}
            >
              <div
                className={cn(
                  "flex h-16 flex-col items-center justify-center border-b border-[--border] relative group",
                  isToday && "bg-[--surface-hover]"
                )}
              >
                <span className="font-serif text-xs uppercase text-[--muted-foreground]">
                  {format(day, "EEE")}
                </span>
                <span
                  className={cn(
                    "mt-1 flex h-8 w-8 items-center justify-center rounded-full font-serif text-xl font-medium",
                    isToday
                      ? "bg-brand-primary text-brand-primary-foreground"
                      : "text-[--foreground]"
                  )}
                >
                  {format(day, "d")}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onNewPost(day)}
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative" style={{ minHeight: `${TIME_SLOT_HEIGHT_PX * TIME_SLOT_COUNT + 40}px` }}>
                {timeSlots.map((_, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="border-b border-[--border]"
                    style={{ height: `${TIME_SLOT_HEIGHT_PX}px` }}
                  ></div>
                ))}
                {postsForDay.map((post) => {
                  const postDate = new Date(post.scheduledAt);
                  // Position is relative to the container which includes all time slots
                  // Each hour slot is TIME_SLOT_HEIGHT_PX tall
                  const topPosition =
                    getHours(postDate) * TIME_SLOT_HEIGHT_PX +
                    (getMinutes(postDate) / 60) * TIME_SLOT_HEIGHT_PX;
                  const Icon = platformIcons[post.platform] || Clock;

                  return (
                    <button
                      type="button"
                      onClick={() => onEditPost(post)}
                      key={post.id}
                      className="absolute left-1 right-1 z-10 flex items-center gap-1.5 rounded bg-brand-primary/90 p-1 text-xs text-brand-primary-foreground shadow-sm transition-all hover:bg-brand-primary text-left cursor-pointer"
                      style={{ top: `${topPosition}px` }}
                      title={`${format(postDate, "h:mm a")} - ${post.content}`}
                    >
                      <Icon className="h-3 w-3 shrink-0" />
                      <span className="font-serif font-bold text-[--brand-primary-foreground] opacity-70">
                        {format(postDate, "h:mma")}
                      </span>
                      <span className="truncate font-serif">
                        {post.content}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
