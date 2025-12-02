// components/calendar/views/month-view.tsx

"use client";

import { useMemo, useState } from "react";
import {
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  isBefore,
  startOfDay,
  isSameMonth,
  addDays,
  subDays,
} from "date-fns";
import { Plus, Loader2 } from "lucide-react";
import type { ScheduledPost } from "../types";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import PlatformIcon from "../components/platform-icon";

interface MonthViewProps {
  currentDate: Date;
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
  onNewPost: (date: Date) => void;
  onDropPost: (postId: string, newDate: Date) => void;
  onOpenDayView: (date: Date, posts: ScheduledPost[]) => void;
  lockedPostId?: string | null;
}

interface DraggablePostProps {
  post: ScheduledPost;
  onEditPost: (post: ScheduledPost) => void;
  hidden?: boolean;
  disabled?: boolean;
}

function DraggablePost({
  post,
  onEditPost,
  hidden,
  disabled,
}: DraggablePostProps) {
  const startDayId = format(new Date(post.scheduledAt), "yyyy-MM-dd");
  const isSent = post.status === "sent";

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: post.id,
      data: {
        post: post,
        startDayId: startDayId,
        status: post.status,
      },
      disabled: disabled || isSent,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging || hidden ? 0 : 1,
  };

  const firstMedia = post.media?.[0];
  const mediaUrl = firstMedia?.thumbnailUrl || firstMedia?.url;

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...(!isSent ? listeners : {})}
      {...attributes}
      onClick={(e) => {
        if (disabled) {
          e.stopPropagation();
          return;
        }
        onEditPost(post);
      }}
      className={cn(
        // LAYOUT STRATEGY:
        // < 2xl: Stacked (flex-col). Visuals on top row (left aligned), Text on bottom row.
        // >= 2xl: Inline (flex-row). Visuals left, Text right.
        "group/item relative flex w-full flex-col items-start rounded-md border border-border bg-white text-left shadow-sm transition-all hover:border-brand-primary hover:shadow-md active:scale-[0.98]",
        "2xl:flex-row 2xl:items-center",

        // Spacing
        "p-1.5 gap-2 2xl:p-2 2xl:gap-3",

        disabled ? "cursor-default opacity-70" : "cursor-pointer",
        isSent &&
          "opacity-75 bg-muted/30 border-muted-foreground/20 hover:border-muted-foreground/40",
        !isSent && !disabled && "cursor-grab active:cursor-grabbing"
      )}
      disabled={disabled}
    >
      {/* 
        VISUALS CONTAINER 
        < 2xl: justify-start gap-2 (Icon and Image sit next to each other on left)
        >= 2xl: w-auto gap-3 (Standard horizontal spacing)
      */}
      <div className="flex w-full items-center justify-start gap-2 2xl:w-auto 2xl:gap-3">
        {/* Icon */}
        <div className="flex shrink-0 items-center justify-center rounded-full bg-muted/50 h-5 w-5 2xl:h-8 2xl:w-8">
          {disabled ? (
            <Loader2 className="h-3 w-3 2xl:h-4 2xl:w-4 animate-spin text-brand-primary" />
          ) : (
            <PlatformIcon
              platform={post.platform}
              className={cn(
                isSent ? "text-muted-foreground/70" : "text-muted-foreground",
                "w-3 h-3 2xl:w-4 2xl:h-4"
              )}
              size={16}
            />
          )}
        </div>

        {/* Thumbnail */}
        {mediaUrl && (
          <div
            className={cn(
              "relative shrink-0 overflow-hidden rounded-sm bg-muted border border-border/50",
              "h-5 w-5 2xl:h-8 2xl:w-8 2xl:rounded-md",
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
      </div>

      {/* 
        TEXT CONTAINER
        < 2xl: Stacked below visuals
        >= 2xl: To the right of visuals (flex-1)
      */}
      <div className="flex w-full min-w-0 flex-col gap-0.5 2xl:flex-1">
        <span
          className={cn(
            "w-full truncate font-medium text-foreground leading-tight text-[10px] 2xl:text-xs",
            isSent && "text-muted-foreground"
          )}
        >
          {post.content || "Untitled Post"}
        </span>
        <span className="font-serif text-[9px] 2xl:text-[10px] font-bold text-muted-foreground shrink-0 leading-none">
          {format(new Date(post.scheduledAt), "h:mm a")}
        </span>
      </div>
    </button>
  );
}

function PostCardForOverlay({ post }: { post: ScheduledPost }) {
  const firstMedia = post.media?.[0];
  const mediaUrl = firstMedia?.thumbnailUrl || firstMedia?.url;

  return (
    <div
      className={cn(
        "flex w-[180px] flex-col items-start gap-2 rounded-md border border-brand-primary bg-white p-2 text-left text-xs shadow-xl cursor-grabbing rotate-2"
      )}
    >
      <div className="flex w-full items-center justify-start gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
          <PlatformIcon
            platform={post.platform}
            className="text-brand-primary"
            size={14}
          />
        </div>
        {mediaUrl && (
          <div className="relative shrink-0 overflow-hidden rounded-md bg-muted h-6 w-6 border border-border/50">
            <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-0.5">
        <span className="truncate font-medium text-foreground">
          {post.content || "Untitled Post"}
        </span>
        <span className="font-serif text-[10px] font-bold text-brand-primary">
          {format(new Date(post.scheduledAt), "h:mm a")}
        </span>
      </div>
    </div>
  );
}

interface DroppableDayProps {
  day: Date;
  isCurrentMonth: boolean;
  onNewPost: (date: Date) => void;
  children: React.ReactNode;
  postCount: number;
}

function DroppableDay({
  day,
  isCurrentMonth,
  onNewPost,
  children,
  postCount,
}: DroppableDayProps) {
  const dayId = format(day, "yyyy-MM-dd");

  const { isOver, setNodeRef } = useDroppable({
    id: dayId,
    data: {
      day: day,
    },
  });

  const isToday = isSameDay(day, new Date());
  const isPastDay = isBefore(day, startOfDay(new Date()));

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group relative flex h-52 flex-col p-2 transition-colors bg-surface overflow-hidden",
        !isCurrentMonth && "bg-muted/10 opacity-60",
        isPastDay &&
          !isToday &&
          "bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,var(--surface-hover)_10px,var(--surface-hover)_20px)]",
        isToday && "bg-surface ring-1 ring-inset ring-brand-primary/20",
        isOver && "bg-brand-primary/5 ring-2 ring-inset ring-brand-primary z-10"
      )}
    >
      <div className="flex w-full items-start justify-between mb-2 flex-shrink-0">
        <div className="flex flex-col">
          <span
            className={cn(
              "font-serif text-lg font-bold leading-none select-none",
              isToday
                ? "text-brand-primary"
                : isCurrentMonth
                ? "text-foreground"
                : "text-muted-foreground/50"
            )}
          >
            {format(day, "d")}
          </span>
          {postCount > 0 && (
            <span className="mt-0.5 text-[10px] font-medium text-muted-foreground">
              {postCount} {postCount === 1 ? "post" : "posts"}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNewPost(day);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-brand-primary z-20"
          aria-label="Add post"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="relative z-10 flex-1 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-1">
        {children}
      </div>

      <div
        className="absolute inset-0 z-0 cursor-pointer"
        onClick={() => onNewPost(day)}
        title="Click to add post"
      />
    </div>
  );
}

export default function MonthView({
  currentDate,
  posts,
  onEditPost,
  onNewPost,
  onDropPost,
  lockedPostId,
}: MonthViewProps) {
  const [activeDragPost, setActiveDragPost] = useState<ScheduledPost | null>(
    null
  );
  const [justDroppedId, setJustDroppedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const monthData = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = subDays(monthStart, getDay(monthStart));
    const endDate = addDays(monthEnd, 6 - getDay(monthEnd));

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragPost(event.active.data.current?.post as ScheduledPost);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const startDayId = active.data.current?.startDayId as string;

    setActiveDragPost(null);

    if (over && active.data.current?.status !== "sent") {
      if (
        typeof over.id === "string" &&
        over.id.match(/^\d{4}-\d{2}-\d{2}$/) &&
        over.id !== startDayId
      ) {
        const postId = active.id as string;
        const newDate = over.data.current?.day as Date;

        setJustDroppedId(postId);
        onDropPost(postId, newDate);

        setTimeout(() => {
          setJustDroppedId(null);
        }, 200);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full overflow-hidden bg-border rounded-lg border border-border flex flex-col">
        {/* Scroll Container for Mobile/Laptop */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          {/* Min-Width Enforcer - Keeps columns usable on smaller screens */}
          <div className="min-w-[800px] md:min-w-[1000px] h-full flex flex-col">
            {/* Header Row */}
            <div className="grid grid-cols-7 gap-px bg-border border-b border-border shrink-0">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="bg-surface-hover p-3 text-center">
                  <span className="eyebrow text-[10px] font-bold tracking-widest text-muted-foreground">
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7 gap-px bg-border flex-1">
              {monthData.map((day) => {
                const isCurrentMonth = isSameMonth(day, currentDate);
                const postsForDay = posts
                  .filter((post) => isSameDay(new Date(post.scheduledAt), day))
                  .sort(
                    (a, b) =>
                      new Date(a.scheduledAt).getTime() -
                      new Date(b.scheduledAt).getTime()
                  );

                return (
                  <DroppableDay
                    key={day.toString()}
                    day={day}
                    isCurrentMonth={isCurrentMonth}
                    onNewPost={onNewPost}
                    postCount={postsForDay.length}
                  >
                    {postsForDay.map((post) => (
                      <DraggablePost
                        key={post.id}
                        post={post}
                        onEditPost={onEditPost}
                        hidden={justDroppedId === post.id}
                        disabled={lockedPostId === post.id}
                      />
                    ))}
                  </DroppableDay>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDragPost ? <PostCardForOverlay post={activeDragPost} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
