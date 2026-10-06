import { create } from "zustand";

import { gamePauseController } from "../core/game-pause-controller";

interface IGameUiState {
  isInventoryOpen: boolean;

  toggleInventory: () => void;
  openInventory: () => void;
  closeInventory: () => void;
}

export const useGameUiStore = create<IGameUiState>((set, get) => ({
  isInventoryOpen: false,

  toggleInventory: () => {
    const isInventoryOpen = get().isInventoryOpen;

    if (isInventoryOpen) {
      gamePauseController.resume("inventory");
    } else {
      gamePauseController.pause("inventory");
    }

    set({
      isInventoryOpen: !isInventoryOpen,
    });
  },

  openInventory: () => {
    gamePauseController.pause("inventory");

    set({
      isInventoryOpen: true,
    });
  },

  closeInventory: () => {
    gamePauseController.resume("inventory");

    set({
      isInventoryOpen: false,
    });
  },
}));
