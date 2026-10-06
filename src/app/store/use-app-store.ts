import { create } from "zustand";

import type { TAppScreen } from "../types/app-screen";

interface IAppState {
  screen: TAppScreen;

  setScreen: (screen: TAppScreen) => void;
}

export const useAppStore = create<IAppState>((set) => ({
  screen: "main-menu",

  setScreen: (screen) => {
    set({ screen });
  },
}));
