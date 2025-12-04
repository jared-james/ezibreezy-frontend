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

        // 2. AUTO-REFRESH & VALIDATION LOGIC:
        // Check if the currently selected workspace still exists in the new data.
        if (state.currentWorkspace) {
          let foundNewData = false;

          for (const node of structure) {
            const ws = node.workspaces.find(
              (w) => w.id === state.currentWorkspace!.id
            );
            if (ws) {
              // Found it! Update state with fresh data (name changes, role changes, etc)
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

          // --- FIX: HANDLE REMOVED WORKSPACES ---
          if (!foundNewData) {
            console.warn(
              "⚠️ [Store] Selected workspace no longer exists in structure. Resetting selection."
            );
            // Clear the stale selection so the fallback logic below can kick in
            set({
              currentWorkspace: null,
              currentOrganization: null,
            });
            if (typeof window !== "undefined") {
              localStorage.removeItem("currentWorkspaceId");
            }
          }
        }

        // 3. Fallback / Default Selection Logic
        const updatedState = get(); // Re-get state after potential reset above

        if (structure.length > 0) {
          // If we have no workspace selected (either it was null, or we just cleared it because it was stale)
          if (!updatedState.currentWorkspace) {
            // Find the first available workspace in the structure
            for (const node of structure) {
              if (node.workspaces.length > 0) {
                const firstWs = node.workspaces[0];
                const workspaceWithOrg = {
                  ...firstWs,
                  organizationId: node.organization.id,
                };

                console.log(
                  "🟡 [Store] Auto-selecting first available workspace:",
                  firstWs.id
                );

                set({
                  currentWorkspace: workspaceWithOrg,
                  currentOrganization: node.organization,
                });

                if (typeof window !== "undefined") {
                  localStorage.setItem("currentWorkspaceId", firstWs.id);
                }
                break; // Stop after finding the first valid one
              }
            }
          }
          // Edge Case: Workspace exists but Org was missing in state (rare sync issue)
          else if (
            updatedState.currentWorkspace &&
            !updatedState.currentOrganization
          ) {
            get().setCurrentWorkspace(updatedState.currentWorkspace.id);
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
