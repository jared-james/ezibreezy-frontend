// components/settings/organization/security-section.tsx

"use client";

import { useState } from "react";
import { OrganizationDangerZone } from "./danger-zone";
import { TransferOwnershipModal } from "./modals/transfer-ownership-modal";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

interface SecuritySectionProps {
  organizationId: string;
  organizationName: string;
}

export function OrganizationSecuritySection({
  organizationId,
  organizationName,
}: SecuritySectionProps) {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const { currentOrganization } = useWorkspaceStore();

  // Double-check permissions on client side
  // Only the 'owner' should see the Danger Zone for transferring ownership
  if (currentOrganization?.role !== "owner") {
    return null;
  }

  return (
    <>
      <OrganizationDangerZone
        organizationName={organizationName}
        onTransferClick={() => setShowTransferModal(true)}
      />

      <TransferOwnershipModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        organizationId={organizationId}
      />
    </>
  );
}
