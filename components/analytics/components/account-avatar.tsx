// components/analytics/components/account-avatar.tsx

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
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLastSelected}
      className={cn(
        "relative transition-all overflow-hidden rounded-full",
        isLastSelected && "cursor-not-allowed opacity-75"
      )}
      title={
        isLastSelected
          ? `${account.name} (Cannot deselect the last account)`
          : isActive
          ? `${account.name} (Currently viewing)`
          : account.name
      }
    >
      <div
        className={cn(
          "h-10 w-10 rounded-full border-2 transition-all overflow-hidden",
          isSelected && "border-primary",
          !isSelected && "border-border hover:border-primary/50"
        )}
      >
        <img
          src={account.img}
          alt={account.name}
          className="h-full w-full object-cover"
        />
      </div>

      {isActive && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-primary text-primary-foreground rounded-full p-0.5 border-2 border-background shadow-sm">
          <Check className="h-3 w-3" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}
