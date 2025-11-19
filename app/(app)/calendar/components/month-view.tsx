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
import {
  Twitter,
  Instagram,
  Linkedin,
  Plus,
  Clock,
  MoreHorizontal,
} from "lucide-react";
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

// REMOVED: VISIBLE_POST_LIMIT constant

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
    <div className="border border-[--border] bg-[--surface]">
      <div className="grid grid-cols-7 border-b border-[--border]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-3 text-center font-serif text-xs font-bold uppercase tracking-wider text-[--muted-foreground] bg-[--surface-hover]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="h-40 border-b border-r border-[--border] bg-[--background] p-2"
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

          // MODIFIED: Use ALL posts, no slicing needed
          const visiblePosts = postsForDay;
          // MODIFIED: Removed hiddenPostsCount calculation

          return (
            <div
              key={day.toString()}
              className="group relative h-40 border-b border-r border-[--border] p-2 transition-colors hover:bg-[--surface-hover] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full font-serif text-sm font-medium",
                    isToday
                      ? "bg-brand-primary text-brand-primary-foreground"
                      : "text-[--foreground]"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>

              {/* NOTE: Keeping this here is fine, but it will only appear on hover now */}
              <Button
                size="icon"
                variant="outline"
                onClick={() => onNewPost(day)}
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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
                      className="w-full group/item flex items-center gap-1.5 rounded bg-[--surface] p-1 text-xs text-[--foreground] border border-transparent hover:border-brand-primary text-left"
                    >
                      <Icon className="h-3 w-3 shrink-0 text-[--muted-foreground]" />
                      <span className="font-serif font-bold text-[--muted-foreground]">
                        {format(new Date(post.scheduledAt), "h:mma")}
                      </span>
                      <span className="truncate font-serif">
                        {post.content}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* REMOVED: The hiddenPostsCount badge/button */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
