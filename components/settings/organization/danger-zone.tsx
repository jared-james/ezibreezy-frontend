// components/settings/organization/danger-zone.tsx

"use client";

import { ShieldAlert, ArrowRightLeft } from "lucide-react";

interface OrganizationDangerZoneProps {
  organizationName: string;
  onTransferClick: () => void;
}

export function OrganizationDangerZone({
  organizationName,
  onTransferClick,
}: OrganizationDangerZoneProps) {
  return (
    <section className="border-t border-dashed border-border pt-12">
      <div className="max-w-2xl mb-8">
        <h3 className="font-serif text-xl font-bold text-error tracking-tight">
          Transfer Ownership
        </h3>
        <p className="font-serif text-sm text-error/70 mt-2 leading-relaxed max-w-lg">
          Transfer ownership of{" "}
          <span className="font-bold text-error">{organizationName}</span> to
          another member. This action is irreversible.
        </p>
      </div>

      <div className="max-w-3xl">
        <button
          onClick={onTransferClick}
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
          <ArrowRightLeft className="w-3.5 h-3.5" />
          Transfer Ownership
        </button>
      </div>
    </section>
  );
}
