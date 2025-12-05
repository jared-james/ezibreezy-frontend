// components/settings/workspace/hooks/use-workspace-modals.ts

import { useState } from "react";

export function useWorkspaceModals() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return {
    showCreateModal,
    showInviteModal,
    showDeleteModal,
    openCreateModal: () => setShowCreateModal(true),
    closeCreateModal: () => setShowCreateModal(false),
    openInviteModal: () => setShowInviteModal(true),
    closeInviteModal: () => setShowInviteModal(false),
    openDeleteModal: () => setShowDeleteModal(true),
    closeDeleteModal: () => setShowDeleteModal(false),
  };
}
