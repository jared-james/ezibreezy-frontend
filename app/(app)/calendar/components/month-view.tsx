// app/(app)/calendar/components/month-view.tsx

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
import { Button } from "@/components/ui/button";
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
        "group/item flex w-full items-center gap-1.5 py-1.5 px-1 text-left text-xs text-foreground transition-colors",
        disabled ? "cursor-default opacity-70" : "hover:bg-brand-primary/5",
        post.status === "sent" && "cursor-not-allowed opacity-60"
      )}
      disabled={post.status === "sent" || disabled}
    >
      {disabled ? (
        <Loader2 className="h-3 w-3 shrink-0 animate-spin text-brand-primary" />
      ) : (
        <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
      )}

      <span className="font-serif font-bold text-muted-foreground">
        {format(new Date(post.scheduledAt), "h:mma")}
      </span>

      <span className="truncate font-serif">{post.content}</span>
    </button>
  );
}

function PostCardForOverlay({ post }: { post: ScheduledPost }) {
  const Icon = platformIcons[post.platform] || Clock;

  return (
    <div
      className={cn(
        "flex w-full min-w-[150px] items-center gap-1.5 py-1.5 px-2 text-left text-xs",
        "bg-background border border-brand-primary",
        "text-foreground",
        "rounded-sm shadow-xl cursor-grabbing"
      )}
    >
      <Icon className="h-3 w-3 shrink-0 text-brand-primary" />
      <span className="font-serif font-bold text-muted-foreground">
        {format(new Date(post.scheduledAt), "h:mma")}
      </span>
      <span className="truncate font-serif">{post.content}</span>
    </div>
  );
}

interface DroppableDayProps {
  day: Date;
  children: React.ReactNode;
}

function DroppableDay({ day, children }: DroppableDayProps) {
  const dayId = format(day, "yyyy-MM-dd");

  const { isOver, setNodeRef } = useDroppable({
    id: dayId,
    data: {
      day: day,
    },
  });

  const isPastDay = isBefore(day, startOfDay(new Date()));

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group relative h-40 border-b border-r border-border p-2 transition-colors",
        isPastDay && "bg-surface-hover/20"
      )}
    >
      {isOver && (
        <div className="absolute inset-0 z-10 border-2 border-dashed border-brand-primary/70 pointer-events-none" />
      )}

      <div className="relative z-20 h-full overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

export default function MonthView({
  currentDate,
  posts,
  onEditPost,
  onNewPost,
  onDropPost,
  onOpenDayView,
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

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const startingDayOfWeek = useMemo(() => {
    return getDay(startOfMonth(currentDate));
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
      <div className="border border-border bg-surface">
        <div className="grid grid-cols-7 border-b border-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => (
              <div
                key={day}
                className={cn(
                  "bg-surface-hover p-3 text-center font-serif text-xs font-bold uppercase tracking-wider text-muted-foreground border-r border-border",
                  index === 6 && "border-r-0"
                )}
              >
                {day}
              </div>
            )
          )}
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
              <DroppableDay key={day.toString()} day={day}>
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
                  className="absolute top-1 right-1 z-30 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-brand-primary hover:text-brand-primary-foreground hover:border-brand-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <div className="mt-1 divide-y divide-border">
                  {visiblePosts.map((post) => (
                    <DraggablePost
                      key={post.id}
                      post={post}
                      onEditPost={onEditPost}
                      hidden={justDroppedId === post.id}
                      disabled={lockedPostId === post.id}
                    />
                  ))}
                </div>
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
