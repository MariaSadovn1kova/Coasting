import { create } from "zustand";

import type { IContainerItem } from "../inventory/container-content";

interface IInventoryState {
  items: IContainerItem[];

  setItems: (items: IContainerItem[]) => void;
  clearItems: () => void;
}

export const useInventoryStore = create<IInventoryState>((set) => ({
  items: [],

  setItems: (items) => {
    set({
      items: items.map((entry) => ({
        ...entry,
      })),
    });
  },

  clearItems: () => {
    set({
      items: [],
    });
  },
}));
