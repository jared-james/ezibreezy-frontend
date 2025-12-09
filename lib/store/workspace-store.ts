// lib/store/workspace-store.ts

"use client";

import { create } from "zustand";

// Backend-aligned types
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  role: "admin" | "editor" | "viewer";
  timezone: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string | null;
  role: "owner" | "admin" | "member";
  plan: "creator" | "agency" | "enterprise";
  status: string;

  // Billing fields (from backend documentation)
  subscriptionStatus?: "active" | "trialing" | "past_due" | "canceled" | "unpaid";
  trialEndsAt?: string | null;

  // Limits
  limitWorkspaces?: number;
  limitUsers?: number;
  limitIntegrations?: number;
  limitStorageBytes?: number;

  // Usage
  storageUsed?: number;
  aiCredits?: number;
}

export interface OrganizationNode {
  organization: Organization;
  workspaces: Workspace[];
}

export interface WorkspaceState {
  structure: OrganizationNode[];
  currentWorkspace: Workspace | null;
  currentOrganization: Organization | null;
  sidebarCollapsed: boolean;
  workspaceSwitcherOpen: boolean;
}

export interface WorkspaceActions {
  setStructure: (structure: OrganizationNode[]) => void;
  setCurrentWorkspace: (workspaceSlugOrId: string) => void;
  toggleSidebar: () => void;
  setWorkspaceSwitcherOpen: (open: boolean) => void;
  clearWorkspace: () => void;
}

const initialState: WorkspaceState = {
  structure: [],
  currentWorkspace: null,
  currentOrganization: null,
  sidebarCollapsed: false,
  workspaceSwitcherOpen: false,
};

export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>()(
  (set, get) => ({
    ...initialState,

    // ----------------------------------------------------------
    // Set entire organization + workspace structure
    // ----------------------------------------------------------
    setStructure: (structure) => {
      set({ structure });
    },

    // ----------------------------------------------------------
    // Set the active workspace by slug OR ID
    // ----------------------------------------------------------
    setCurrentWorkspace: (workspaceSlugOrId) => {
      const { structure } = get();
      let selectedWorkspace: Workspace | null = null;
      let selectedOrg: Organization | null = null;

      for (const node of structure) {
        const ws = node.workspaces.find(
          (w) => w.slug === workspaceSlugOrId || w.id === workspaceSlugOrId
        );

        if (ws) {
          selectedWorkspace = {
            ...ws,
            organizationId: node.organization.id,
          };
          selectedOrg = node.organization;
          break;
        }
      }

      if (selectedWorkspace && selectedOrg) {
        set({
          currentWorkspace: selectedWorkspace,
          currentOrganization: selectedOrg,
        });
      }
    },

    // ----------------------------------------------------------
    // UI state
    // ----------------------------------------------------------
    toggleSidebar: () => {
      set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed,
      }));
    },

    setWorkspaceSwitcherOpen: (open: boolean) => {
      set({ workspaceSwitcherOpen: open });
    },

    // ----------------------------------------------------------
    // Reset store (e.g., on logout)
    // ----------------------------------------------------------
    clearWorkspace: () => {
      set(initialState);
    },
  })
);
