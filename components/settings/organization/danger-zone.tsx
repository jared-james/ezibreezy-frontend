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
    <div className="mt-12 border-t-4 border-double border-amber-500/20 pt-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm shrink-0">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-xl font-bold text-amber-700 uppercase tracking-tight">
            Danger Zone
          </h3>
          <p className="font-serif text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Manage critical security settings for{" "}
            <span className="font-bold text-foreground">
              {organizationName}
            </span>
            . Transferring ownership is irreversible and will immediately revoke
            your access to billing and organization-level management.
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={onTransferClick}
              className="px-6 py-3 border border-dashed border-amber-600 text-amber-700 hover:bg-amber-50 hover:border-amber-700 transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" /> Transfer Ownership
            </button>

            {/* Future: Delete Organization Button could go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
