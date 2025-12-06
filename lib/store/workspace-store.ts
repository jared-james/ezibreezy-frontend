// lib/store/workspace-store.ts

"use client";

import { create } from "zustand";

// Matches backend: src/auth/workspace.guard.ts
export interface Workspace {
  id: string;
  name: string;
  slug: string; // Human-readable slug for URLs (e.g., "marketing-team")
  role: "admin" | "editor" | "viewer";
  timezone: string;
  organizationId: string;
}

// Matches backend: src/db/schemas/organization.schema.ts
export interface Organization {
  id: string;
  name: string;
  slug: string | null;
  role: "owner" | "admin" | "member";
  plan: "free" | "solo" | "agency" | "enterprise";
  status: string;
}

export interface OrganizationNode {
  organization: Organization;
  workspaces: Omit<Workspace, "organizationId">[];
}

export interface WorkspaceState {
  // Data cache (hydrated from server props, not persisted)
  structure: OrganizationNode[];
  currentWorkspace: Workspace | null;
  currentOrganization: Organization | null;

  // UI-only state
  sidebarCollapsed: boolean;
  workspaceSwitcherOpen: boolean;
}

export interface WorkspaceActions {
  // Data setters (for hydration from server)
  setStructure: (structure: OrganizationNode[]) => void;
  setCurrentWorkspace: (workspaceIdOrSlug: string) => void; // Accepts slug or UUID

  // UI state setters
  toggleSidebar: () => void;
  setWorkspaceSwitcherOpen: (open: boolean) => void;

  // Keep clear for logout
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

    setStructure: (structure) => {
      console.log(
        "🟡 [Store] setStructure called with length:",
        structure.length
      );
      // Simply update structure - no auto-selection logic
      set({ structure });
    },

    setCurrentWorkspace: (workspaceIdOrSlug) => {
      const { structure } = get();
      let foundWorkspace: Workspace | null = null;
      let foundOrg: Organization | null = null;

      for (const node of structure) {
        // Try to match by slug first, then fall back to UUID
        const ws = node.workspaces.find(
          (w) => w.slug === workspaceIdOrSlug || w.id === workspaceIdOrSlug
        );
        if (ws) {
          foundWorkspace = { ...ws, organizationId: node.organization.id };
          foundOrg = node.organization;
          break;
        }
      }

      if (foundWorkspace && foundOrg) {
        set({
          currentWorkspace: foundWorkspace,
          currentOrganization: foundOrg,
        });
      } else {
        console.warn(`❌ Workspace ${workspaceIdOrSlug} not found in structure.`);
      }
    },

    toggleSidebar: () => {
      set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
    },

    setWorkspaceSwitcherOpen: (open) => {
      set({ workspaceSwitcherOpen: open });
    },

    clearWorkspace: () => {
      set(initialState);
    },
  })
);
