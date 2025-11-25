// components/post-editor/previews/instagram/instagram-header.tsx

import { cn } from "@/lib/utils";
import Image from "next/image";

interface InstagramHeaderProps {
  avatarUrl: string | null;
  primaryName: string;
  location?: string;
}

export function InstagramHeader({
  avatarUrl,
  primaryName,
  location,
}: InstagramHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-[--border]">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${primaryName} profile picture`}
            width={32}
            height={32}
            className="rounded-full border border-[--border] shrink-0 object-cover"
          />
        ) : (
          <div
            className={cn(
              "rounded-full bg-[--muted] border border-[--border] shrink-0"
            )}
            style={{ width: 32, height: 32 }}
          />
        )}
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
  );
}
