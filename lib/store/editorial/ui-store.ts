// lib/store/editorial/ui-store.ts

"use client";

import { create } from "zustand";

export interface EditorialUIState {
  activeCaptionFilter: string;
  isInitialized: boolean;
}

export interface EditorialUIActions {
  setUIState: (updates: Partial<EditorialUIState>) => void;
  initializeFromFullPost: () => void;
  resetUI: () => void;
}

const initialUIState: EditorialUIState = {
  activeCaptionFilter: "all",
  isInitialized: false,
};

export const useEditorialUIStore = create<
  EditorialUIState & EditorialUIActions
>((set) => ({
  ...initialUIState,

  setUIState: (updates) => {
    set((state) => ({ ...state, ...updates }));
  },

  initializeFromFullPost: () => {
    set({ isInitialized: true });
  },

  resetUI: () => {
    set(initialUIState);
  },
}));
