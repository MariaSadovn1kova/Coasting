import { create } from "zustand";

interface IGameUiState {
  isInventoryOpen: boolean;

  toggleInventory: () => void;
  openInventory: () => void;
  closeInventory: () => void;
}

export const useGameUiStore = create<IGameUiState>((set) => ({
  isInventoryOpen: false,

  toggleInventory: () => {
    set((state) => ({
      isInventoryOpen: !state.isInventoryOpen,
    }));
  },

  openInventory: () => {
    set({
      isInventoryOpen: true,
    });
  },

  closeInventory: () => {
    set({
      isInventoryOpen: false,
    });
  },
}));
