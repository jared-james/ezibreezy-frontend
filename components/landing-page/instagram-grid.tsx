// components/landing-page/instagram-grid.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Post = {
  id: string;
  type: "text" | "image" | "quote";
  content: string;
  imageSrc?: string;
  gradientStyle: React.CSSProperties;
  textColor: string;
  borderColor: string;
};

// Updated content to form a cohesive message across the grid
const RAW_CONTENT = [
  // Row 1
  { id: "1", type: "text", content: "CHAOS\nIS" },
  { id: "2", type: "quote", content: "Optional." },
  { id: "3", type: "text", content: "ORDER\nIS" },

  // Row 2
  { id: "4", type: "quote", content: "Essential." },
  { id: "5", type: "text", content: "TASTE\nIS" },
  { id: "6", type: "quote", content: "Timeless." },

  // Row 3
  { id: "7", type: "text", content: "YOUR\nRULES" },
  { id: "8", type: "quote", content: "Apply." },
  { id: "9", type: "text", content: "THIS\nIS" },

  // Row 4
  { id: "10", type: "quote", content: "The..." },
  { id: "11", type: "text", content: "FINAL\nWORD" },
  { id: "12", type: "quote", content: "Period." },
] as const;

/**
 * GENERATE THE "JEWEL TONE" OMBRE
 */
const generateGradientPosts = (): Post[] => {
  const count = RAW_CONTENT.length;

  const startHue = 160; // Cool Deep Emerald
  const endHue = 145; // Vibrant Forest

  const startLit = 22;
  const endLit = 42;

  const startSat = 85;
  const endSat = 75;

  return RAW_CONTENT.map((item, index) => {
    const step = index / (count - 1);

    const hue = startHue - step * (startHue - endHue);
    const lightness = startLit + step * (endLit - startLit);
    const saturation = startSat + step * (endSat - startSat);

    const bgStyle = {
      background: `linear-gradient(135deg, 
        hsl(${hue}, ${saturation}%, ${lightness}%) 0%, 
        hsl(${hue}, ${saturation}%, ${lightness - 8}%) 100%)`,
    };

    return {
      ...item,
      gradientStyle: bgStyle,
      textColor: "text-white",
      borderColor: "border-white/20",
    };
  });
};

export default function InstagramGridBoard() {
  const [items, setItems] = useState<Post[]>(() => generateGradientPosts());
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }

  return (
    <div className="w-full max-w-lg mx-auto py-12">
      {/* Title Removed here, moved to parent component */}

      {/* Container with WHITE grid lines */}
      <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-200 ring-1 ring-black/5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="bg-white">
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {/* gap-1 with bg-white container creates the white lines */}
              <div className="grid grid-cols-3 gap-1">
                {items.map((post) => (
                  <SortableItem key={post.id} post={post} />
                ))}
              </div>
            </SortableContext>
          </div>

          <DragOverlay adjustScale={true}>
            {activeId ? (
              <GridPost
                post={items.find((i) => i.id === activeId)!}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

// --- Sortable Item Wrapper ---
function SortableItem({ post }: { post: Post }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="aspect-square relative touch-none group"
    >
      <GridPost post={post} />
    </div>
  );
}

function GridPost({ post, isOverlay }: { post: Post; isOverlay?: boolean }) {
  return (
    <div
      style={post.gradientStyle}
      className={`w-full h-full flex items-center justify-center relative overflow-hidden select-none transition-transform ${
        post.textColor
      } ${
        isOverlay
          ? "shadow-2xl ring-4 ring-white z-50 cursor-grabbing rounded-xl scale-105"
          : "cursor-grab active:cursor-grabbing"
      }`}
    >
      {post.type === "text" && (
        <span className="font-black text-2xl tracking-tighter text-center whitespace-pre-line leading-none drop-shadow-md">
          {post.content}
        </span>
      )}

      {post.type === "quote" && (
        <span className="font-serif italic text-lg p-4 text-center leading-tight opacity-95 font-medium">
          {post.content}
        </span>
      )}

      {post.type === "image" && post.imageSrc && (
        <Image
          src={post.imageSrc}
          alt="Grid item"
          fill
          className="object-cover opacity-90 mix-blend-overlay"
        />
      )}

      {!isOverlay && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
    </div>
  );
}
