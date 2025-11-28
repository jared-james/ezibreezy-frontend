"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  X,
  PlusSquare,
  Loader2,
  Battery,
  Wifi,
  Signal,
  ChevronLeft,
  MoreHorizontal,
  Home,
  Search,
  Heart,
  UserCircle,
  Grid3X3,
  Clapperboard,
  UserSquare,
  Trash2,
  Upload,
  Smartphone,
  LayoutGrid,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as db from "../lib/db";

export type VisualPost = {
  id: string;
  url: string;
  file: Blob;
  order: number;
};

export default function PlannerBoard() {
  const [items, setItems] = useState<VisualPost[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [viewMode, setViewMode] = useState<"mobile" | "grid">("mobile");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedPosts = await db.getAllPosts();
        const sortedPosts = savedPosts.sort((a, b) => a.order - b.order);
        const visualPosts = sortedPosts.map((p) => ({
          id: p.id,
          file: p.file,
          order: p.order,
          url: URL.createObjectURL(p.file),
        }));
        setItems(visualPosts);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load saved grid");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newFiles = Array.from(e.target.files);
    const newPosts: VisualPost[] = [];
    const currentLength = items.length;

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      if (!file.type.startsWith("image/")) continue;

      const id = crypto.randomUUID();
      const order = currentLength + i;

      const post = {
        id,
        file,
        order,
        url: URL.createObjectURL(file),
      };

      newPosts.push(post);
      await db.savePost({ id, file, order });
    }

    setItems((prev) => [...prev, ...newPosts]);
    toast.success(`${newPosts.length} posts added to grid`);
    e.target.value = "";
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await db.deletePost(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Post deleted");
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to wipe the grid?")) return;
    await db.clearAllPosts();
    setItems([]);
    setShowMenu(false);
    toast.success("Grid reset");
  };

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        const updates = newOrder.map((item, index) => ({
          id: item.id,
          file: item.file,
          order: index,
        }));
        db.updatePostOrder(updates);
        return newOrder;
      });
    }
    setActiveId(null);
  }

  // --- REUSABLE GRID CONTENT ---
  const renderGridContent = () => (
    <>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-300 gap-4">
          <Grid3X3 className="w-12 h-12 stroke-1" />
          <div className="text-center">
            <p className="font-semibold text-gray-900 text-lg">No Posts Yet</p>
            <p className="text-sm text-gray-400">
              Use the upload button to add photos
            </p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-0.5 bg-white">
              {items.map((post) => (
                <SortableItem
                  key={post.id}
                  post={post}
                  onDelete={(e) => handleDelete(post.id, e)}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay adjustScale={true}>
            {activeId ? (
              <GridPost
                post={items.find((i) => i.id === activeId)!}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center text-foreground/50 flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="font-mono text-xs uppercase tracking-widest">
          Initializing Simulator...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* VIEW TOGGLE */}
      <div className="mb-8 flex items-center bg-white border border-foreground/20 p-1 rounded-lg shadow-sm">
        <button
          onClick={() => setViewMode("mobile")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-xs font-bold font-mono uppercase tracking-wider",
            viewMode === "mobile"
              ? "bg-brand-primary text-white shadow-sm"
              : "text-foreground/50 hover:bg-foreground/5"
          )}
        >
          <Smartphone className="w-4 h-4" />
          <span>Mobile</span>
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-xs font-bold font-mono uppercase tracking-wider",
            viewMode === "grid"
              ? "bg-brand-primary text-white shadow-sm"
              : "text-foreground/50 hover:bg-foreground/5"
          )}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Grid Only</span>
        </button>
      </div>

      {viewMode === "mobile" ? (
        /* PHONE FRAME SIMULATOR */
        <div className="relative w-full max-w-[420px] bg-white rounded-[3rem] border-[8px] border-zinc-900 shadow-2xl overflow-hidden aspect-[9/19.5]">
          {/* STATUS BAR */}
          <div className="h-14 bg-white flex items-end justify-between px-8 pb-2 select-none relative z-20">
            <span className="text-xs font-bold text-black ml-2">9:41</span>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-900 rounded-b-2xl flex items-center justify-center">
              <div className="w-16 h-4 bg-black/50 rounded-full" />
            </div>

            <div className="flex items-center gap-1.5 text-black mr-1">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* APP HEADER */}
          <div className="h-12 bg-white flex items-center justify-between px-4 border-b border-gray-50 z-20 relative">
            <div className="flex items-center gap-1 font-bold text-lg cursor-pointer">
              <ChevronLeft className="w-6 h-6 -ml-2" />
              <span>ezy_breezy_official</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-6 h-6" />
              </button>

              {showMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={handleClearAll}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 text-sm font-semibold text-left transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset Simulator
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="h-[calc(100%-144px)] overflow-y-auto scrollbar-hide bg-white relative">
            <div className="px-5 pt-4 pb-0">
              <div className="flex items-center justify-between mb-6">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                      <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center text-zinc-300">
                        <UserCircle className="w-16 h-16" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                    <PlusSquare className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1 flex justify-around ml-4">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg leading-tight">
                      {items.length}
                    </span>
                    <span className="text-[11px] text-gray-900">Posts</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg leading-tight">
                      12.4K
                    </span>
                    <span className="text-[11px] text-gray-900">Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg leading-tight">420</span>
                    <span className="text-[11px] text-gray-900">Following</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h1 className="font-bold text-sm">EziBreezy Editor</h1>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  Editorial tools for the modern creator ✦
                  <br />
                  Plan your grid, split carousels, ship faster.
                  <br />
                  <span className="text-blue-900 font-medium">
                    ezibreezy.com
                  </span>
                </p>
              </div>

              <div className="flex gap-2 mb-8">
                <button className="flex-1 bg-zinc-100 py-1.5 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors">
                  Edit Profile
                </button>
                <button className="flex-1 bg-zinc-100 py-1.5 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors">
                  Share Profile
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-2">
                {[
                  { label: "Design", color: "bg-zinc-100" },
                  { label: "Tools", color: "bg-zinc-100" },
                  { label: "Inspo", color: "bg-zinc-100" },
                  { label: "FAQs", color: "bg-zinc-100" },
                ].map((h, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 shrink-0"
                  >
                    <div className="w-16 h-16 rounded-full border border-gray-200 bg-gray-50 p-1">
                      <div className="w-full h-full rounded-full bg-zinc-200/50" />
                    </div>
                    <span className="text-xs text-black/80">{h.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex border-t border-gray-100">
                <button className="flex-1 flex justify-center py-3 border-b-2 border-black">
                  <Grid3X3 className="w-6 h-6 text-black" />
                </button>
                <button className="flex-1 flex justify-center py-3 border-b-2 border-transparent text-gray-400">
                  <Clapperboard className="w-6 h-6" />
                </button>
                <button className="flex-1 flex justify-center py-3 border-b-2 border-transparent text-gray-400">
                  <UserSquare className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* DROP ZONE (MOBILE) */}
            <div className="min-h-[400px] bg-white pb-20">
              {renderGridContent()}
            </div>
          </div>

          {/* BOTTOM NAV */}
          <div className="h-[90px] bg-white border-t border-gray-100 flex items-start justify-between px-6 pt-4 absolute bottom-0 left-0 right-0 z-30">
            <button className="p-2 text-black">
              <Home className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button className="p-2 text-gray-400 hover:text-black transition-colors">
              <Search className="w-6 h-6 stroke-[2.5]" />
            </button>

            <div className="relative">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-black hover:scale-110 transition-transform active:scale-95"
              >
                <PlusSquare className="w-7 h-7 stroke-[2.5]" />
              </button>
            </div>

            <button className="p-2 text-gray-400 hover:text-black transition-colors">
              <Heart className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button className="p-2">
              <div className="w-6 h-6 rounded-full bg-zinc-200 border border-black/10" />
            </button>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/80 rounded-full z-40" />
        </div>
      ) : (
        /* GRID ONLY VIEW */
        <div className="w-full max-w-[500px] bg-white shadow-xl border border-foreground/10 p-4 min-h-[600px] animate-in fade-in zoom-in-95 duration-200">
          <div className="border-b border-foreground/10 pb-4 mb-4 flex justify-between items-center">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">
              Raw Grid Preview
            </span>
            <span className="font-mono text-xs font-bold">
              {items.length} Posts
            </span>
          </div>
          {renderGridContent()}
        </div>
      )}

      {/* HELPER TEXT */}
      <div className="mt-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          Tap <PlusSquare className="w-3 h-3 inline mx-1 -mt-0.5" /> to add
          photos • Drag to reorder
        </p>
      </div>

      {/* EXTERNAL CONTROLS (FOOTER) */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-[420px]">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 w-full flex items-center justify-center gap-2 h-12 bg-brand-primary text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-foreground transition-all shadow-md"
        >
          <Upload className="w-4 h-4" />
          Upload Photos
        </button>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="w-full sm:w-auto px-6 h-12 flex items-center justify-center gap-2 border-2 border-red-100 text-red-600 bg-red-50/50 font-mono text-xs font-bold uppercase tracking-widest hover:bg-red-100 hover:border-red-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        )}

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}

function SortableItem({
  post,
  onDelete,
}: {
  post: VisualPost;
  onDelete: (e: React.MouseEvent) => void;
}) {
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
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="aspect-square relative group outline-none"
    >
      <GridPost post={post} onDelete={onDelete} />
    </div>
  );
}

function GridPost({
  post,
  isOverlay,
  onDelete,
}: {
  post: VisualPost;
  isOverlay?: boolean;
  onDelete?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className={cn(
        "w-full h-full relative overflow-hidden bg-gray-100",
        isOverlay
          ? "shadow-2xl ring-2 ring-brand-primary z-50 scale-105"
          : "cursor-move"
      )}
    >
      <img
        src={post.url}
        alt="Grid item"
        className="w-full h-full object-cover pointer-events-none select-none"
      />

      {!isOverlay && onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 backdrop-blur-sm z-10"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
