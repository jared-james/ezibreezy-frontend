// components/post-editor/previews/threads/threads-header.tsx

"use client";

import { MoreHorizontal } from "lucide-react";

interface ThreadsHeaderProps {
  primaryName: string;
}

export function ThreadsHeader({ primaryName }: ThreadsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-bold text-foreground">{primaryName}</span>
        <span className="text-muted-foreground">1m</span>
      </div>
      <MoreHorizontal className="h-4 w-4 text-foreground" />
    </div>
  );
}
