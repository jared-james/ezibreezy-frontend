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

const RAW_CONTENT = [
  { id: "1", type: "text", content: "CONTENT\nCREATOR" },
  { id: "2", type: "quote", content: "Less is more." },
  { id: "3", type: "text", content: "BRAND\nSTORY" },
  { id: "4", type: "quote", content: "Design System" },
  { id: "5", type: "text", content: "VISUAL\nIDENTITY" },
  { id: "6", type: "quote", content: "Authenticity" },
  { id: "7", type: "text", content: "SOCIAL\nFIRST" },
  { id: "8", type: "quote", content: "Simplicity." },
  { id: "9", type: "text", content: "EZI\nBREEZY" },
  { id: "10", type: "quote", content: "Intentional" },
  { id: "11", type: "text", content: "COMING\nSOON" },
  { id: "12", type: "quote", content: "Your Voice." },
] as const;

/**
 * GENERATE THE "JEWEL TONE" OMBRE
 *
 * Adjusted Range:
 * Start: Deep Emerald (Visible Green, not Black)
 * End:   Vibrant Forest (Rich Green, not Lime)
 */
const generateGradientPosts = (): Post[] => {
  const count = RAW_CONTENT.length;

  // Configuration for Rich Green Ombre
  const startHue = 160; // Cool Deep Emerald
  const endHue = 145; // Your Brand Green

  // Lightness: Mid-Dark range for richness
  const startLit = 22; // Deep, heavy green (Classic "Rolex" green depth)
  const endLit = 42; // Vibrant, punchy green (but nowhere near pastel/lime)

  // Saturation: High to keep it "Menace" and bold
  const startSat = 85;
  const endSat = 75;

  return RAW_CONTENT.map((item, index) => {
    // 0.0 (top) to 1.0 (bottom)
    const step = index / (count - 1);

    const hue = startHue - step * (startHue - endHue);
    const lightness = startLit + step * (endLit - startLit);
    const saturation = startSat + step * (endSat - startSat);

    // Internal gradient for the tile texture (adds the "Ombre" feel per tile)
    const bgStyle = {
      background: `linear-gradient(135deg, 
        hsl(${hue}, ${saturation}%, ${lightness}%) 0%, 
        hsl(${hue}, ${saturation}%, ${lightness - 8}%) 100%)`,
    };

    return {
      ...item,
      gradientStyle: bgStyle,
      textColor: "text-white", // Always white for high contrast on these rich greens
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
    <div className="w-full max-w-6xl mx-auto py-12">
      <h2 className="font-serif text-5xl md:text-7xl font-black leading-[0.9] mb-12 tracking-tighter text-center text-stone-900">
        The Grid
      </h2>

      {/* Container is now bg-white to create WHITE grid lines */}
      <div className="w-full max-w-[500px] mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-200 ring-1 ring-black/5">
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

      {/* Decorative circle placeholder */}
      {post.type === "image" && !post.imageSrc && (
        <div
          className={`w-16 h-16 rounded-full border-2 ${post.borderColor} opacity-60`}
        />
      )}

      {/* Hover Shine */}
      {!isOverlay && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
    </div>
  );
}
