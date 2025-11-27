// components/post-editor/previews/facebook/facebook-header.tsx

"use client";

import { cn } from "@/lib/utils";

interface FacebookHeaderProps {
  avatarUrl: string | null;
  primaryName: string;
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
      <img
        src={avatarUrl}
        alt={`${primaryName} profile picture`}
        className="rounded-full border border-[--border] shrink-0 object-cover"
        style={{ width: size, height: size }}
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

export function FacebookHeader({
  avatarUrl,
  primaryName,
}: FacebookHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-3">
      <ProfileAvatar size={40} avatarUrl={avatarUrl} primaryName={primaryName} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[--foreground]">
          {primaryName}
        </p>
        <div className="flex items-center gap-1 text-xs text-[--muted-foreground]">
          <span>Just now</span>
          <span>·</span>
          <span>🌐</span>
        </div>
      </div>
      <div className="text-[--muted-foreground]">
        <span className="text-lg">···</span>
      </div>
    </div>
  );
}
