// components/post-editor/previews/pinterest/pinterest-options.tsx

"use client";

import { Link as LinkIcon, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PinterestBoardSelector } from "./pinterest-board-selector";

interface PinterestOptionsProps {
  integrationId: string | null;
  boardId: string | null;
  onBoardChange: (boardId: string) => void;
  link: string;
  onLinkChange: (link: string) => void;
  altText?: string;
  onAltTextChange?: (text: string) => void;
}

export function PinterestOptions({
  integrationId,
  boardId,
  onBoardChange,
  link,
  onLinkChange,
  altText = "",
  onAltTextChange,
}: PinterestOptionsProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-5 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-bold text-foreground flex items-center gap-2">
          Pinterest Settings
        </h3>
      </div>

      <PinterestBoardSelector
        integrationId={integrationId}
        selectedBoardId={boardId}
        onBoardSelect={onBoardChange}
      />

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <LinkIcon className="w-3 h-3" />
          Destination Link
        </label>
        <Input
          value={link}
          onChange={(e) => onLinkChange(e.target.value)}
          placeholder="https://your-website.com"
          className="h-9"
        />
      </div>

      {onAltTextChange && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            Pin Alt Text
          </label>
          <Input
            value={altText}
            onChange={(e) => onAltTextChange(e.target.value)}
            placeholder="Describe your Pin for screen readers"
            className="h-9"
            maxLength={500}
          />
          <p className="text-[10px] text-muted-foreground text-right">
            {altText.length}/500
          </p>
        </div>
      )}
    </div>
  );
}
