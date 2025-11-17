// app/(app)/ideas/components/edit-modal/channel-selector.tsx

"use client";

import { PlusCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Platform {
  id: string;
  name: string;
  icon: LucideIcon;
  accounts: Array<{ id: string; name: string; img: string }>;
}

interface ChannelSelectorProps {
  platforms: Platform[];
  activePlatforms: Set<string>;
  onTogglePlatform: (platformId: string) => void;
}

export default function ChannelSelector({
  platforms,
  activePlatforms,
  onTogglePlatform,
}: ChannelSelectorProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="eyebrow text-[--foreground]">Channels</p>
        <a
          href="/settings/connections"
          className="flex items-center gap-2 text-xs font-serif text-[--brand-accent] hover:underline"
        >
          <PlusCircle className="w-3 h-3" />
          Connect Accounts
        </a>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const hasAccounts = platform.accounts.length > 0;
          const isActive = activePlatforms.has(platform.id);

          return (
            <button
              key={platform.id}
              onClick={() => hasAccounts && onTogglePlatform(platform.id)}
              disabled={!hasAccounts}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                hasAccounts
                  ? "cursor-pointer hover:border-border-primary"
                  : "cursor-not-allowed opacity-40"
              } ${
                isActive
                  ? "border-primary bg-white"
                  : "border-[--border] bg-white hover:bg-[--surface-hover]"
              }`}
              title={platform.name}
            >
              <Icon className="w-5 h-5 text-[--foreground]" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
