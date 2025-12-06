// components/settings/organization/security-section.tsx

"use client";

import { useState } from "react";
import { OrganizationDangerZone } from "./danger-zone";
import { TransferOwnershipModal } from "./modals/transfer-ownership-modal";

interface SecuritySectionProps {
  organizationId: string;
  organizationName: string;
  userRole: "owner" | "admin" | "member";
}

export function OrganizationSecuritySection({
  organizationId,
  organizationName,
  userRole,
}: SecuritySectionProps) {
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Only the 'owner' should see the Danger Zone
  if (userRole !== "owner") {
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
