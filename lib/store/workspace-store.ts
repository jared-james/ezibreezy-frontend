// lib/store/workspace-store.ts

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Matches backend: src/auth/workspace.guard.ts
export interface Workspace {
  id: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  timezone: string;
  organizationId: string; // Helper for flat lookups, though hierarchical structure implies it
}

// Matches backend: src/db/schemas/organization.schema.ts
export interface Organization {
  id: string;
  name: string;
  slug: string | null;
  role: "owner" | "admin" | "member";
  plan: "free" | "solo" | "agency" | "enterprise";
  status: string; // subscription_status
}

// Matches the structure from WorkspacesService.getHierarchicalContext
export interface OrganizationNode {
  organization: Organization;
  workspaces: Omit<Workspace, "organizationId">[];
}

export interface WorkspaceState {
  // The full tree for the switcher UI
  structure: OrganizationNode[];

  // The currently active context
  currentWorkspace: Workspace | null;
  currentOrganization: Organization | null;
}

export interface WorkspaceActions {
  setStructure: (structure: OrganizationNode[]) => void;
  setCurrentWorkspace: (workspaceId: string) => void;
  clearWorkspace: () => void;
}

const initialState: WorkspaceState = {
  structure: [],
  currentWorkspace: null,
  currentOrganization: null,
};

export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStructure: (structure) => {
        console.log("🟡 [Store] setStructure called with:", {
          structureLength: structure.length,
          structure,
        });

        set({ structure });

        const state = get();
        console.log("🟡 [Store] Current state after set:", {
          hasCurrentWorkspace: !!state.currentWorkspace,
          hasCurrentOrg: !!state.currentOrganization,
          currentWorkspace: state.currentWorkspace,
          currentOrganization: state.currentOrganization,
          structureLength: structure.length,
        });

        // If we have a workspace but no organization (can happen with localStorage persistence),
        // or if we have no workspace at all, set it up
        if (structure.length > 0) {
          if (state.currentWorkspace && !state.currentOrganization) {
            // We have a workspace (from localStorage) but no org - need to find and set the org
            console.log(
              "🟡 [Store] Workspace exists but no org - finding org for workspace:",
              state.currentWorkspace.id
            );
            get().setCurrentWorkspace(state.currentWorkspace.id);
          } else if (!state.currentWorkspace) {
            // No workspace at all - default to first one
            const firstOrg = structure[0];
            console.log("🟡 [Store] No workspace - defaulting to first org:", firstOrg);

            if (firstOrg.workspaces.length > 0) {
              const firstWs = firstOrg.workspaces[0];
              console.log(
                "🟡 [Store] Auto-selecting first workspace:",
                firstWs.id
              );
              get().setCurrentWorkspace(firstWs.id);
            } else {
              console.warn("⚠️ [Store] First org has no workspaces");
            }
          }
        }
      },

      setCurrentWorkspace: (workspaceId) => {
        console.log("🟣 [Store] setCurrentWorkspace called with ID:", workspaceId);
        const { structure } = get();

        console.log("🟣 [Store] Searching in structure:", {
          structureLength: structure.length,
          structure,
        });

        // Find the workspace and its parent organization in the tree
        let foundWorkspace: Workspace | null = null;
        let foundOrg: Organization | null = null;

        for (const node of structure) {
          const ws = node.workspaces.find((w) => w.id === workspaceId);
          if (ws) {
            foundWorkspace = { ...ws, organizationId: node.organization.id };
            foundOrg = node.organization;
            break;
          }
        }

        console.log("🟣 [Store] Search result:", {
          foundWorkspace,
          foundOrg,
        });

        if (foundWorkspace && foundOrg) {
          console.log("✅ [Store] Setting current workspace and org");
          set({
            currentWorkspace: foundWorkspace,
            currentOrganization: foundOrg,
          });

          // Sync to localStorage for API interceptor
          if (typeof window !== "undefined") {
            localStorage.setItem("currentWorkspaceId", foundWorkspace.id);
            console.log(
              "✅ [Store] Saved to localStorage:",
              foundWorkspace.id
            );
          }
        } else {
          console.warn(`❌ Workspace ${workspaceId} not found in structure.`);
        }
      },

      clearWorkspace: () => {
        set(initialState);
        if (typeof window !== "undefined") {
          localStorage.removeItem("currentWorkspaceId");
        }
      },
    }),
    {
      name: "workspace-storage",
      partialize: (state) => ({
        // We persist everything so the UI doesn't flicker on reload
        structure: state.structure,
        currentWorkspace: state.currentWorkspace,
        currentOrganization: state.currentOrganization,
      }),
    }
  )
);
