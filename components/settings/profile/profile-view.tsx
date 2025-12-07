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
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500 pb-16">
      {/*
        Using space-y-12 (3rem) for tighter spacing between sections
      */}
      <div className="space-y-12">
        <ProfileForm
          initialDisplayName={initialDisplayName}
          initialEmail={initialEmail}
        />

        <ProfileDangerZone onDeleteClick={() => setShowDeleteModal(true)} />
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        userEmail={initialEmail}
      />
    </div>
  );
}
