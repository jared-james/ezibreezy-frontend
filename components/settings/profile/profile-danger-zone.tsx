// components/settings/profile/profile-danger-zone.tsx

"use client";

import { Trash2 } from "lucide-react";

interface ProfileDangerZoneProps {
  onDeleteClick: () => void;
}

export function ProfileDangerZone({ onDeleteClick }: ProfileDangerZoneProps) {
  return (
    <div className="mt-12 border-t-4 border-double border-error/20 pt-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-error/5 border border-error/20 rounded-sm shrink-0">
          <Trash2 className="w-6 h-6 text-error" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-xl font-bold text-error uppercase tracking-tight">
            Danger Zone
          </h3>
          <p className="font-serif text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Deleting your account is irreversible. All your personal data,
            preferences, and any organizations where you are the sole owner will
            be permanently removed.
          </p>

          <div className="mt-6">
            <button
              onClick={onDeleteClick}
              className="px-8 py-3 border border-dashed border-error text-error hover:bg-error/10 hover:border-error transition-all text-xs font-bold uppercase tracking-wider"
            >
              Delete Personal Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
