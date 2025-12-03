// components/analytics/components/account-avatar.tsx

"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Account } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

interface AccountAvatarProps {
  account: Account;
  isSelected: boolean;
  isActive: boolean;
  isLastSelected: boolean;
  onClick: () => void;
}

export function AccountAvatar({
  account,
  isSelected,
  isActive,
  isLastSelected,
  onClick,
}: AccountAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const isSyncing = account.status === "syncing";

  // Reset error state if the account prop changes (though usually these are keyed by ID)
  useEffect(() => {
    setImageError(false);
  }, [account.img]);

  // Get the first letter for the fallback (e.g., "EziBreezy" -> "E")
  const fallbackInitial = account.name
    ? account.name.replace("@", "").charAt(0).toUpperCase()
    : "?";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLastSelected}
      className={cn(
        "relative transition-all overflow-visible rounded-full group",
        isLastSelected && "cursor-not-allowed opacity-75"
      )}
      title={account.name}
    >
      <div
        className={cn(
          "h-10 w-10 rounded-full border-2 transition-all overflow-hidden flex items-center justify-center",
          isSelected
            ? "border-primary"
            : "border-border hover:border-primary/50",
          // Add background color for the fallback state
          imageError || !account.img ? "bg-muted" : "bg-background"
        )}
      >
        {!imageError && account.img ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={account.img}
            alt={account.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-mono text-sm font-bold text-muted-foreground select-none">
            {fallbackInitial}
          </span>
        )}
      </div>

      {isActive && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-primary text-primary-foreground rounded-full p-0.5 border-2 border-background shadow-sm z-10">
          <Check className="h-3 w-3" strokeWidth={3} />
        </div>
      )}

      {isSyncing && (
        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      )}
    </button>
  );
}
