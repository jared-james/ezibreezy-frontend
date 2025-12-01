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
import {
  Twitter,
  Instagram,
  Linkedin,
  Plus,
  Clock,
  Loader2,
} from "lucide-react";
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

interface MonthViewProps {
  currentDate: Date;
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
  onNewPost: (date: Date) => void;
  onDropPost: (postId: string, newDate: Date) => void;
  onOpenDayView: (date: Date, posts: ScheduledPost[]) => void;
  lockedPostId?: string | null;
}

const platformIcons: Record<string, React.ElementType> = {
  x: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

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

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: post.id,
      data: {
        post: post,
        startDayId: startDayId,
        status: post.status,
      },
      disabled: disabled || post.status === "sent",
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging || hidden ? 0 : 1,
  };

  const Icon = platformIcons[post.platform] || Clock;

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        if (disabled) {
          e.stopPropagation();
          return;
        }
        onEditPost(post);
      }}
      className={cn(
        "group/item relative flex w-full items-center gap-2 rounded-sm border border-border bg-white p-1.5 text-left text-xs shadow-sm transition-all hover:border-brand-primary hover:shadow-md active:scale-[0.98]",
        disabled
          ? "cursor-default opacity-70"
          : "cursor-grab active:cursor-grabbing",
        post.status === "sent" && "cursor-not-allowed opacity-60 bg-muted/30"
      )}
      disabled={post.status === "sent" || disabled}
    >
      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted/50">
        {disabled ? (
          <Loader2 className="h-2.5 w-2.5 animate-spin text-brand-primary" />
        ) : (
          <Icon className="h-2.5 w-2.5 text-muted-foreground" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate font-medium text-foreground leading-tight">
          {post.content || "Untitled Post"}
        </span>
        <span className="ml-auto font-serif text-[9px] font-bold text-muted-foreground shrink-0">
          {format(new Date(post.scheduledAt), "h:mma")}
        </span>
      </div>
    </button>
  );
}

function PostCardForOverlay({ post }: { post: ScheduledPost }) {
  const Icon = platformIcons[post.platform] || Clock;

  return (
    <div
      className={cn(
        "flex w-[180px] items-center gap-2 rounded-sm border border-brand-primary bg-white p-2 text-left text-xs shadow-xl cursor-grabbing rotate-2"
      )}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
        <Icon className="h-3 w-3 text-brand-primary" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
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
        "group relative flex h-48 flex-col p-2 transition-colors bg-surface overflow-hidden",
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

      <div className="relative z-10 flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-1">
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
      <div className="bg-border overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-border border-b border-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-surface-hover p-3 text-center">
              <span className="eyebrow text-[10px] font-bold tracking-widest text-muted-foreground">
                {day}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-border">
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

      <DragOverlay dropAnimation={null}>
        {activeDragPost ? <PostCardForOverlay post={activeDragPost} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
