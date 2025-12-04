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
  structure: OrganizationNode[];
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
        console.log(
          "🟡 [Store] setStructure called with length:",
          structure.length
        );

        // 1. Update the structure immediately
        set({ structure });

        const state = get();

        // 2. AUTO-REFRESH LOGIC:
        // If we currently have a workspace selected, we must look it up in the
        // NEW structure to see if its name/timezone/role has changed.
        if (state.currentWorkspace) {
          let foundNewData = false;

          for (const node of structure) {
            const ws = node.workspaces.find(
              (w) => w.id === state.currentWorkspace!.id
            );
            if (ws) {
              // We found the currently selected workspace in the new data!
              // Update the state objects to match the new data.
              set({
                currentWorkspace: {
                  ...ws,
                  organizationId: node.organization.id,
                },
                currentOrganization: node.organization,
              });
              foundNewData = true;
              console.log(
                "🔄 [Store] Refreshed current workspace with new data:",
                ws.name
              );
              break;
            }
          }

          // Optional: If the workspace is GONE (deleted), revert to default logic?
          // For now, we leave it, or handle it in the component.
        }

        // 3. Fallback / Default Selection Logic (Existing Code)
        const updatedState = get(); // Re-get state after potential refresh above

        if (structure.length > 0) {
          if (
            updatedState.currentWorkspace &&
            !updatedState.currentOrganization
          ) {
            // Edge case: Workspace exists in LocalStorage but Org is missing
            get().setCurrentWorkspace(updatedState.currentWorkspace.id);
          } else if (!updatedState.currentWorkspace) {
            // Edge case: No workspace selected at all -> Select first available
            const firstOrg = structure[0];
            if (firstOrg.workspaces.length > 0) {
              const firstWs = firstOrg.workspaces[0];
              console.log(
                "🟡 [Store] Auto-selecting first workspace:",
                firstWs.id
              );
              get().setCurrentWorkspace(firstWs.id);
            }
          }
        }
      },

      setCurrentWorkspace: (workspaceId) => {
        const { structure } = get();
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

        if (foundWorkspace && foundOrg) {
          set({
            currentWorkspace: foundWorkspace,
            currentOrganization: foundOrg,
          });

          if (typeof window !== "undefined") {
            localStorage.setItem("currentWorkspaceId", foundWorkspace.id);
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
        structure: state.structure,
        currentWorkspace: state.currentWorkspace,
        currentOrganization: state.currentOrganization,
      }),
    }
  )
);
