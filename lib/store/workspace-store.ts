// lib/store/workspace-store.ts

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Workspace {
  id: string;
  name: string;
  organizationId: string;
  role: "admin" | "editor" | "viewer";
  timezone: string;
}

export interface Organization {
  id: string;
  name: string;
  role: "owner" | "admin" | "member";
  plan: "solo" | "agency" | "enterprise";
}

export interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  organizations: Organization[];
}

export interface WorkspaceActions {
  setCurrentWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[], organizations: Organization[]) => void;
  switchWorkspace: (workspaceId: string) => void;
  clearWorkspace: () => void;
}

const initialState: WorkspaceState = {
  currentWorkspace: null,
  workspaces: [],
  organizations: [],
};

export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentWorkspace: (workspace) => {
        set({ currentWorkspace: workspace });
        // Sync to localStorage for API interceptor
        if (typeof window !== "undefined") {
          localStorage.setItem("currentWorkspaceId", workspace.id);
        }
      },

      setWorkspaces: (workspaces, organizations) => {
        set({ workspaces, organizations });
        // Auto-select first workspace if none selected
        const current = get().currentWorkspace;
        if (!current && workspaces.length > 0) {
          get().setCurrentWorkspace(workspaces[0]);
        }
      },

      switchWorkspace: (workspaceId) => {
        const workspace = get().workspaces.find((w) => w.id === workspaceId);
        if (workspace) {
          get().setCurrentWorkspace(workspace);
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
        currentWorkspace: state.currentWorkspace,
      }),
    }
  )
);
