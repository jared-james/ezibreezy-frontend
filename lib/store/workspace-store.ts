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
  workspaces: Workspace[];
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
  setCurrentWorkspace: (workspaceSlugOrId: string) => void; // Accepts slug (preferred) or UUID (legacy)

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

    setCurrentWorkspace: (workspaceSlugOrId) => {
      const { structure } = get();
      let foundWorkspace: Workspace | null = null;
      let foundOrg: Organization | null = null;

      for (const node of structure) {
        // Priority: match by slug first (preferred), then fall back to UUID (legacy support)
        const ws = node.workspaces.find(
          (w) => w.slug === workspaceSlugOrId || w.id === workspaceSlugOrId
        );
        if (ws) {
          foundWorkspace = { ...ws, organizationId: node.organization.id };
          foundOrg = node.organization;
          break;
        }
      }

      if (foundWorkspace && foundOrg) {
        console.log(
          `✅ [Store] Set current workspace: ${foundWorkspace.name} (${foundWorkspace.slug})`
        );
        set({
          currentWorkspace: foundWorkspace,
          currentOrganization: foundOrg,
        });
      } else {
        console.warn(
          `❌ Workspace ${workspaceSlugOrId} not found in structure.`
        );
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
