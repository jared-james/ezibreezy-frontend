// lib/store/editorial-store.ts

import { create } from "zustand";
import type { EditorialDraft } from "@/lib/types/editorial";

interface EditorialStore {
  draft: EditorialDraft | null;
  setDraft: (draft: EditorialDraft) => void;
  clearDraft: () => void;
  hasDraft: () => boolean;
}

/**
 * Zustand store for managing editorial draft data
 * Used for transferring data from Ideas page to Editorial page
 */
export const useEditorialStore = create<EditorialStore>((set, get) => ({
  draft: null,

  /**
   * Set the editorial draft data
   * Called when user clicks "Open in Editorial" from Ideas modal
   */
  setDraft: (draft: EditorialDraft) => {
    set({ draft });
  },

  /**
   * Clear the draft data
   * Called after Editorial page has consumed the data
   */
  clearDraft: () => {
    set({ draft: null });
  },

  /**
   * Check if there's a draft available
   */
  hasDraft: () => {
    return get().draft !== null;
  },
}));
