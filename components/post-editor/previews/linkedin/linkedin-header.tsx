// components/post-editor/previews/linkedin/linkedin-header.tsx

"use client";

import { cn } from "@/lib/utils";

interface LinkedInHeaderProps {
  avatarUrl: string | null;
  primaryName: string;
  accountName: string;
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

export function LinkedInHeader({
  avatarUrl,
  primaryName,
  accountName,
}: LinkedInHeaderProps) {
  return (
    <div className="flex items-start gap-3 p-3">
      <ProfileAvatar
        size={48}
        avatarUrl={avatarUrl}
        primaryName={primaryName}
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[--foreground] truncate">
          {primaryName}
        </p>
        <p className="text-xs text-[--muted-foreground] truncate">
          @{accountName}
        </p>
        <p className="text-xs text-[--muted-foreground]">Now · 🌐</p>
      </div>
      <div className="text-[--muted-foreground]">
        <span className="text-lg">···</span>
      </div>
    </div>
  );
}
