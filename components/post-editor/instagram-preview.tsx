// components/post-editor/instagram-preview.tsx

import { memo, useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ImageIcon,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { renderCaptionWithHashtags } from "./render-caption";
import { UserTagDto } from "@/lib/api/publishing";

interface InstagramPreviewProps {
  caption: string;
  mediaPreview: string | null;
  platformUsername: string;
  displayName: string | null;
  avatarUrl: string | null;
  collaborators: string;
  location: string;
  postType: "post" | "reel" | "story";
  userTags: UserTagDto[];
  onUserTagsChange: (tags: UserTagDto[]) => void;
}

const ProfileAvatar = ({
  size,
  avatarUrl,
  primaryName,
}: {
  size: number;
  avatarUrl: string | null;
  primaryName: string;
}) => {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={`${primaryName} profile picture`}
        width={size}
        height={size}
        className="rounded-full border border-[--border] shrink-0 object-cover"
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-[--muted] border border-[--border] shrink-0"
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Profile image placeholder"
    />
  );
};

function InstagramPreview({
  caption,
  mediaPreview,
  platformUsername,
  displayName,
  avatarUrl,
  collaborators,
  location,
  postType,
  userTags,
  onUserTagsChange,
}: InstagramPreviewProps) {
  const accountName = platformUsername.replace(/^@/, "");
  const primaryName = displayName || accountName || "Account";
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  const [isTaggingMode, setIsTaggingMode] = useState(false);
  const [localTags, setLocalTags] = useState<UserTagDto[]>(userTags);
  const [newTag, setNewTag] = useState<{
    x: number;
    y: number;
    username: string;
  } | null>(null);

  useEffect(() => {
    setLocalTags(userTags);
  }, [userTags]);

  useEffect(() => {
    onUserTagsChange(localTags);
  }, [localTags, onUserTagsChange]);

  const isTaggingSupported = mediaPreview && postType === "post";

  useEffect(() => {
    if (!isTaggingSupported) {
      setIsTaggingMode(false);
    }
  }, [isTaggingSupported]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTaggingMode || !mediaContainerRef.current) return;
    const rect = mediaContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setNewTag({ x, y, username: "" });
  };

  const handleAddTag = () => {
    if (newTag && newTag.username.trim()) {
      const finalTag = {
        ...newTag,
        username: newTag.username.trim().replace(/^@/, ""),
      };
      setLocalTags((prev) => [...prev, finalTag]);
      setNewTag(null);
    }
  };

  const handleRemoveTag = (index: number) => {
    setLocalTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full bg-[--surface] border border-[--border] shadow-lg max-w-sm mx-auto">
      <div className="flex items-center justify-between p-3 border-b border-[--border]">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            size={32}
            avatarUrl={avatarUrl}
            primaryName={primaryName}
          />
          <div>
            <span className="font-semibold text-sm text-[--foreground]">
              {primaryName}
            </span>
            {location && (
              <p className="text-xs text-[--muted-foreground] leading-none">
                {location}
              </p>
            )}
          </div>
        </div>
        <div className="text-[--muted-foreground]">
          <span className="font-serif text-sm">...</span>
        </div>
      </div>

      <div
        ref={mediaContainerRef}
        onClick={handleImageClick}
        className={cn(
          "relative aspect-square bg-[--background]",
          mediaPreview ? "" : "flex items-center justify-center",
          isTaggingMode && "cursor-crosshair"
        )}
      >
        {mediaPreview ? (
          <img
            src={mediaPreview}
            alt="Media Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[--muted-foreground] text-center p-12">
            <ImageIcon className="w-8 h-8 mb-2" />
            <p>No Image/Video Attached</p>
          </div>
        )}

        {isTaggingMode && (
          <div className="absolute inset-0 bg-black/30 p-2 flex flex-col justify-between pointer-events-none">
            <p className="text-center text-xs font-semibold text-white bg-black/50 rounded-full px-3 py-1 self-center">
              Click on the photo to tag a user
            </p>
          </div>
        )}

        {localTags.map((tag, index) => (
          <div
            key={index}
            className="absolute group flex items-center gap-1 rounded bg-black/70 p-1 text-xs text-white"
            style={{
              left: `${tag.x * 100}%`,
              top: `${tag.y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span>{tag.username}</span>
            <button
              onClick={() => handleRemoveTag(index)}
              className="opacity-0 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {newTag && (
          <div
            className="absolute"
            style={{
              left: `${newTag.x * 100}%`,
              top: `${newTag.y * 100}%`,
              transform: "translate(-50%, 8px)",
            }}
          >
            <div className="w-40 rounded bg-white p-1 shadow-lg">
              <input
                type="text"
                autoFocus
                placeholder="@username"
                value={newTag.username}
                onChange={(e) =>
                  setNewTag({ ...newTag, username: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                onBlur={handleAddTag}
                className="w-full border-none bg-transparent px-2 py-1 text-sm outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between p-3">
        <div className="flex items-center gap-4 text-[--muted-foreground]">
          <Heart className="size-6 hover:text-[--foreground] cursor-pointer" />
          <MessageCircle className="size-6 hover:text-[--foreground] cursor-pointer" />
          <Send className="size-6 hover:text-[--foreground] cursor-pointer" />
        </div>
        <Bookmark className="size-6 text-[--muted-foreground] hover:text-[--foreground] cursor-pointer" />
      </div>

      <div className="px-3 pb-4 space-y-2">
        <p className="text-xs font-semibold text-[--foreground]">0 likes</p>

        <div className="text-sm">
          <span className="font-semibold mr-1">{primaryName}</span>
          <span className="whitespace-pre-wrap">
            {renderCaptionWithHashtags(caption)}
          </span>
        </div>

        {collaborators && (
          <p className="text-xs text-[--brand-primary]">
            With <span className="font-semibold">{collaborators}</span>
          </p>
        )}

        <p className="text-xs text-[--muted-foreground]">View all 0 comments</p>
        <p className="text-[0.65rem] uppercase text-[--muted-foreground]">
          Now
        </p>
      </div>

      <div className="p-3 text-center border-t border-[--border]">
        {isTaggingSupported ? (
          <button
            onClick={() => setIsTaggingMode(!isTaggingMode)}
            className={cn(
              "flex items-center gap-2 justify-center w-full font-serif font-bold text-sm",
              isTaggingMode
                ? "text-brand-accent"
                : "text-brand-primary hover:text-brand-accent"
            )}
          >
            <UserPlus className="h-4 w-4" />
            {isTaggingMode ? "Done Tagging" : "Tag People"}
          </button>
        ) : (
          <p className="text-xs text-[--muted-foreground] italic">
            Instagram Preview
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(InstagramPreview);
