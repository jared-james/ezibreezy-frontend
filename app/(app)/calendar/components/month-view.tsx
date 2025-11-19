// app/(app)/calendar/components/month-view.tsx

"use client";

import { useMemo } from "react";
import {
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
} from "date-fns";
import { Twitter, Instagram, Linkedin, Plus, Clock } from "lucide-react";
import type { ScheduledPost } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MonthViewProps {
  currentDate: Date;
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
  onNewPost: (date: Date) => void;
  onOpenDayView: (date: Date, posts: ScheduledPost[]) => void;
}

const platformIcons: Record<string, React.ElementType> = {
  x: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

export default function MonthView({
  currentDate,
  posts,
  onEditPost,
  onNewPost,
  onOpenDayView,
}: MonthViewProps) {
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const startingDayOfWeek = useMemo(() => {
    return getDay(startOfMonth(currentDate));
  }, [currentDate]);

  return (
    <div className="border border-border bg-surface">
      <div className="grid grid-cols-7 border-b border-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={day}
            className={cn(
              "bg-surface-hover p-3 text-center font-serif text-xs font-bold uppercase tracking-wider text-muted-foreground border-r border-border",
              index === 6 && "border-r-0"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="h-40 border-b border-r border-border bg-background p-2"
          />
        ))}

        {monthDays.map((day) => {
          const isToday = isSameDay(day, new Date());
          const postsForDay = posts
            .filter((post) => isSameDay(new Date(post.scheduledAt), day))
            .sort(
              (a, b) =>
                new Date(a.scheduledAt).getTime() -
                new Date(b.scheduledAt).getTime()
            );

          const visiblePosts = postsForDay;

          return (
            <div
              key={day.toString()}
              className="group relative h-40 overflow-y-auto border-b border-r border-border p-2 transition-colors hover:bg-surface-hover"
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full font-serif text-sm font-medium",
                    isToday
                      ? "bg-brand-primary text-brand-primary-foreground"
                      : "text-foreground"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>

              <Button
                size="icon"
                variant="outline"
                onClick={() => onNewPost(day)}
                className="absolute top-1 right-1 z-10 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <div className="mt-1 space-y-1">
                {visiblePosts.map((post) => {
                  const Icon = platformIcons[post.platform] || Clock;

                  return (
                    <button
                      type="button"
                      onClick={() => onEditPost(post)}
                      key={post.id}
                      className="group/item flex w-full items-center gap-1.5 rounded border border-transparent bg-surface p-1 text-left text-xs text-foreground hover:border-brand-primary"
                    >
                      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />

                      <span className="font-serif font-bold text-muted-foreground">
                        {format(new Date(post.scheduledAt), "h:mma")}
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
