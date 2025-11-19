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

const TIME_SLOT_HEIGHT_PX = 120;
const TIME_SLOT_COUNT = 24;

const timeSlots = Array.from(
  { length: TIME_SLOT_COUNT },
  (_, i) => `${String(i).padStart(2, "0")}:00`
);

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
    <div className="border border-border bg-surface flex">
      {/* TIME COLUMN */}
      <div className="w-20 shrink-0 border-r border-border">
        <div className="h-12 border-b border-border"></div>

        {timeSlots.map((time) => (
          <div
            key={time}
            className="relative border-b border-border"
            style={{ height: `${TIME_SLOT_HEIGHT_PX}px` }}
          >
            <span className="absolute -top-2.5 right-2 bg-surface px-1.5 font-serif text-sm text-muted-foreground">
              {format(new Date(`1970-01-01T${time}`), "h a")}
            </span>
          </div>
        ))}
      </div>

      {/* DAY GRID */}
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
                "border-r border-border",
                dayIndex === 6 && "border-r-0"
              )}
            >
              {/* DAY HEADER */}
              <div
                className="relative group flex h-12 items-center justify-center gap-2 border-b border-border bg-surface-hover px-2"
              >
                <span className="font-serif text-sm font-medium text-muted-foreground">
                  {format(day, "EEE")}
                </span>

                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full font-serif text-sm font-medium",
                    isToday
                      ? "bg-brand-primary text-brand-primary-foreground"
                      : "text-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onNewPost(day)}
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* TIME GRID + POSTS */}
              <div
                className="relative"
                style={{
                  minHeight: `${TIME_SLOT_HEIGHT_PX * TIME_SLOT_COUNT + 40}px`,
                }}
              >
                {timeSlots.map((_, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="border-b border-border"
                    style={{ height: `${TIME_SLOT_HEIGHT_PX}px` }}
                  ></div>
                ))}

                {postsForDay.map((post) => {
                  const postDate = new Date(post.scheduledAt);
                  const topPosition =
                    getHours(postDate) * TIME_SLOT_HEIGHT_PX +
                    (getMinutes(postDate) / 60) * TIME_SLOT_HEIGHT_PX;

                  const Icon = platformIcons[post.platform] || Clock;

                  return (
                    <button
                      type="button"
                      onClick={() => onEditPost(post)}
                      key={post.id}
                      className="group/item absolute left-1 right-1 flex items-center gap-1.5 rounded border border-transparent bg-surface p-1 text-left text-xs text-foreground hover:border-brand-primary"
                      style={{ top: `${topPosition}px` }}
                    >
                      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />

                      <span className="font-serif font-bold text-muted-foreground">
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
