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
import { Twitter, Instagram, Linkedin } from "lucide-react";
import type { ScheduledPost } from "../types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface WeekViewProps {
  currentDate: Date;
  posts: ScheduledPost[];
}

const platformIcons = {
  x: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

// FIX: Pad the hour to ensure it's always two digits (e.g., '01:00')
const timeSlots = Array.from(
  { length: 24 },
  (_, i) => `${String(i).padStart(2, "0")}:00`
);

export default function WeekView({ currentDate, posts }: WeekViewProps) {
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  return (
    <div className="border border-[--border] bg-[--surface] flex">
      <div className="w-16 shrink-0 border-r border-[--border]">
        <div className="h-20 border-b border-[--border]"></div>
        {timeSlots.map((time) => (
          <div
            key={time}
            className="h-16 border-b border-[--border] p-2 text-right font-serif text-[0.7rem] text-[--muted-foreground]"
          >
            {format(new Date(`1970-01-01T${time}`), "h a")}
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
                  "flex h-20 flex-col items-center justify-center border-b border-[--border]",
                  isToday && "bg-[--surface-hover]"
                )}
              >
                <span className="font-serif text-xs uppercase text-[--muted-foreground]">
                  {format(day, "EEE")}
                </span>
                <span
                  className={cn(
                    "mt-1 flex h-8 w-8 items-center justify-center rounded-full font-serif text-2xl",
                    isToday
                      ? "bg-brand-primary text-brand-primary-foreground"
                      : "text-[--foreground]"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="relative">
                {timeSlots.map((_, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="h-16 border-b border-[--border]"
                  ></div>
                ))}
                {postsForDay.map((post) => {
                  const postDate = new Date(post.scheduledAt);
                  const topPosition =
                    getHours(postDate) * 64 + (getMinutes(postDate) / 60) * 64;
                  const Icon = platformIcons[post.platforms[0]];

                  return (
                    <Link
                      href={`/editorial?draft=${post.id}`}
                      key={post.id}
                      className="absolute left-1 right-1 z-10 flex items-center gap-1.5 rounded bg-brand-primary p-1 text-xs text-brand-primary-foreground shadow-lg transition-all hover:ring-2 hover:ring-brand-primary-hover"
                      style={{ top: `${topPosition}px` }}
                    >
                      <Icon className="h-3 w-3 shrink-0" />
                      <span className="truncate font-serif">{post.title}</span>
                    </Link>
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
