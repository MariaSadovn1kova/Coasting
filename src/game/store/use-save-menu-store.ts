import { create } from "zustand";

import { gamePauseController } from "../core/game-pause-controller";

export type TSaveMenuMode = "save" | "load";

interface ISaveMenuState {
  isOpen: boolean;
  mode: TSaveMenuMode;

  openSaveMenu: () => void;
  openLoadMenu: () => void;
  closeSaveMenu: () => void;
}

export const useSaveMenuStore = create<ISaveMenuState>((set) => ({
  isOpen: false,
  mode: "save",

  openSaveMenu: () => {
    gamePauseController.pause("save-menu");

    set({
      isOpen: true,
      mode: "save",
    });
  },

  openLoadMenu: () => {
    gamePauseController.pause("save-menu");

    set({
      isOpen: true,
      mode: "load",
    });
  },

  closeSaveMenu: () => {
    gamePauseController.resume("save-menu");

    set({
      isOpen: false,
    });
  },
}));
