"use client";

import {
  Send,
  Tag,
  Hash,
  AtSign,
  MapPin,
  BookmarkPlus,
  Edit3,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DistributionPanelProps {
  onOpenInEditorial?: () => void;
  onSaveClipping?: () => void;
  labels?: string;
  hashtags?: string;
  firstComment?: string;
  collaborators?: string;
  location?: string;
  onLabelsChange?: (value: string) => void;
  onHashtagsChange?: (value: string) => void;
  onFirstCommentChange?: (value: string) => void;
  onCollaboratorsChange?: (value: string) => void;
  onLocationChange?: (value: string) => void;
  showActionButtons?: boolean; // <-- Add this prop
}

export default function DistributionPanel({
  onOpenInEditorial,
  onSaveClipping,
  labels = "",
  hashtags = "",
  firstComment = "",
  collaborators = "",
  location = "",
  onLabelsChange,
  onHashtagsChange,
  onFirstCommentChange,
  onCollaboratorsChange,
  onLocationChange,
  showActionButtons = true, // <-- Give it a default value
}: DistributionPanelProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h3 className="font-serif text-xl font-bold text-foreground">
          Distribution
        </h3>
        <Send className="w-4 h-4 text-muted" />
      </div>

      <div className="bg-surface border border-border p-5 space-y-6 mt-4">
        <div className="space-y-4">
          {/* Input fields remain unchanged... */}
          <div className="relative">
            <label htmlFor="labels" className="eyebrow">
              Labels
            </label>
            <div className="relative mt-2">
              <Tag className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
              <Input
                id="labels"
                value={labels}
                onChange={(e) => onLabelsChange?.(e.target.value)}
                placeholder="Promotion, News, Evergreen..."
                className="pl-8 h-9"
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="hashtags" className="eyebrow">
              Hashtags
            </label>
            <div className="relative mt-2">
              <Hash className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
              <Input
                id="hashtags"
                value={hashtags}
                onChange={(e) => onHashtagsChange?.(e.target.value)}
                placeholder="#business #marketing"
                className="pl-8 h-9"
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="first-comment" className="eyebrow">
              First Comment
            </label>
            <div className="relative mt-2">
              <MessageSquare className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
              <Input
                id="first-comment"
                value={firstComment}
                onChange={(e) => onFirstCommentChange?.(e.target.value)}
                placeholder="Add your first comment..."
                className="pl-8 h-9"
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="collaborators" className="eyebrow">
              Collaborators
            </label>
            <div className="relative mt-2">
              <AtSign className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
              <Input
                id="collaborators"
                value={collaborators}
                onChange={(e) => onCollaboratorsChange?.(e.target.value)}
                placeholder="@username"
                className="pl-8 h-9"
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="location" className="eyebrow">
              Location
            </label>
            <div className="relative mt-2">
              <MapPin className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={(e) => onLocationChange?.(e.target.value)}
                placeholder="New York, NY"
                className="pl-8 h-9"
              />
            </div>
          </div>
        </div>

        {/* --- START OF CHANGE --- */}
        {showActionButtons && (
          <div className="pt-4 space-y-3">
            <Button onClick={onSaveClipping} className="w-full gap-2">
              <BookmarkPlus className="w-4 h-4" />
              Save Clipping
            </Button>
            <Button
              onClick={onOpenInEditorial}
              variant="outline"
              className="w-full gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Open in Editorial
            </Button>
          </div>
        )}
        {/* --- END OF CHANGE --- */}
      </div>
    </div>
  );
}
