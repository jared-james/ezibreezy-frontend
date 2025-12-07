// components/settings/profile/profile-view.tsx

"use client";

import { useState } from "react";
import ProfileForm from "./profile-form";
import { ProfileDangerZone } from "./profile-danger-zone";
import { DeleteAccountModal } from "./delete-account-modal";

interface ProfileViewProps {
  initialDisplayName: string;
  initialEmail: string;
}

export function ProfileView({
  initialDisplayName,
  initialEmail,
}: ProfileViewProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="max-w-4xl space-y-12">
      {/* 1. Main Profile Form (Name, Email, Password) */}
      <ProfileForm
        initialDisplayName={initialDisplayName}
        initialEmail={initialEmail}
      />

      {/* 2. Danger Zone (Delete Account) */}
      <ProfileDangerZone onDeleteClick={() => setShowDeleteModal(true)} />

      {/* 3. Modal Layer */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        userEmail={initialEmail}
      />
    </div>
  );
}
