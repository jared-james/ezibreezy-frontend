// components/settings/profile/profile-danger-zone.tsx

"use client";

import { Trash2 } from "lucide-react";

interface ProfileDangerZoneProps {
  onDeleteClick: () => void;
}

export function ProfileDangerZone({ onDeleteClick }: ProfileDangerZoneProps) {
  return (
    <section className="border-t border-dashed border-border pt-12">
      <div className="max-w-2xl mb-8">
        <h3 className="font-serif text-xl font-bold text-error tracking-tight">
          Delete Account
        </h3>
        <p className="font-serif text-sm text-error/70 mt-2 leading-relaxed max-w-lg">
          Permanently remove your account and all associated personal data. This
          action cannot be undone.
        </p>
      </div>

      <div className="max-w-3xl">
        <button
          onClick={onDeleteClick}
          className="
            group
            inline-flex items-center gap-2
            text-error hover:text-red-700
            font-mono text-[10px] uppercase tracking-[0.2em] font-bold
            transition-colors
            border border-error/30 hover:border-red-700
            rounded-sm
            px-4 py-2
          "
        >
          <Trash2 className="w-3.5 h-3.5" />
          Confirm Deletion
        </button>
      </div>
    </section>
  );
}
