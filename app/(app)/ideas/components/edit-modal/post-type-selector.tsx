// app/(app)/ideas/components/edit-modal/post-type-selector.tsx

"use client";

import { Type, Image as ImageIcon, Video } from "lucide-react";

interface PostTypeSelectorProps {
  postType: "text" | "image" | "video";
  onPostTypeChange: (type: "text" | "image" | "video") => void;
}

export default function PostTypeSelector({
  postType,
  onPostTypeChange,
}: PostTypeSelectorProps) {
  return (
    <div>
      <label className="eyebrow">Post Type</label>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onPostTypeChange("text")}
          className={`btn btn-sm ${
            postType === "text"
              ? "bg-[--foreground] text-[--background]"
              : ""
          }`}
        >
          <Type className="w-4 h-4" /> Text
        </button>
        <button
          onClick={() => onPostTypeChange("image")}
          className={`btn btn-sm ${
            postType === "image"
              ? "bg-[--foreground] text-[--background]"
              : ""
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Image
        </button>
        <button
          onClick={() => onPostTypeChange("video")}
          className={`btn btn-sm ${
            postType === "video"
              ? "bg-[--foreground] text-[--background]"
              : ""
          }`}
        >
          <Video className="w-4 h-4" /> Video
        </button>
      </div>
    </div>
  );
}
