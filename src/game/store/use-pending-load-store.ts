import { create } from "zustand";

import type { TSaveSlot } from "../save/save-slot";

interface IPendingLoadState {
  slot: TSaveSlot | null;

  setPendingLoad: (slot: TSaveSlot) => void;

  clearPendingLoad: () => void;
}

export const usePendingLoadStore = create<IPendingLoadState>((set) => ({
  slot: null,

  setPendingLoad: (slot) => {
    set({
      slot,
    });
  },

  clearPendingLoad: () => {
    set({
      slot: null,
    });
  },
}));
