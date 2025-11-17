// app/(app)/ideas/components/edit-modal/post-type-selector.tsx

"use client";

import { Type, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <Button
          onClick={() => onPostTypeChange("text")}
          variant={postType === "text" ? "primary" : "outline"}
          size="sm"
          className="gap-1.5"
        >
          <Type className="w-4 h-4" />
          Text
        </Button>

        <Button
          onClick={() => onPostTypeChange("image")}
          variant={postType === "image" ? "primary" : "outline"}
          size="sm"
          className="gap-1.5"
        >
          <ImageIcon className="w-4 h-4" />
          Image
        </Button>

        <Button
          onClick={() => onPostTypeChange("video")}
          variant={postType === "video" ? "primary" : "outline"}
          size="sm"
          className="gap-1.5"
        >
          <Video className="w-4 h-4" />
          Video
        </Button>
      </div>
    </div>
  );
}
