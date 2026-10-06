import { create } from "zustand";

import type { IContainerItem } from "../inventory/container-content";

import { gamePauseController } from "../core/game-pause-controller";

interface IContainerState {
  containerId: string | null;
  items: IContainerItem[];

  isOpen: boolean;

  openContainer: (containerId: string, items: IContainerItem[]) => void;

  setItems: (items: IContainerItem[]) => void;

  closeContainer: () => void;
}

export const useContainerStore = create<IContainerState>((set) => ({
  containerId: null,
  items: [],

  isOpen: false,

  openContainer: (containerId, items) => {
    gamePauseController.pause("container");

    set({
      containerId,
      items: items.map((entry) => ({
        ...entry,
      })),

      isOpen: true,
    });
  },

  setItems: (items) => {
    set({
      items: items.map((entry) => ({
        ...entry,
      })),
    });
  },

  closeContainer: () => {
    gamePauseController.resume("container");

    set({
      containerId: null,
      items: [],
      isOpen: false,
    });
  },
}));
