import { create } from "zustand";

export type TStartupStage = "loading" | "studio" | "disclaimer" | "complete";

interface IStartupStore {
  stage: TStartupStage;

  setStage: (stage: TStartupStage) => void;

  showStudio: () => void;

  showDisclaimer: () => void;

  complete: () => void;

  reset: () => void;
}

export const useStartupStore = create<IStartupStore>((set) => ({
  stage: "loading",

  setStage: (stage) => {
    set({
      stage,
    });
  },

  showStudio: () => {
    set({
      stage: "studio",
    });
  },

  showDisclaimer: () => {
    set({
      stage: "disclaimer",
    });
  },

  complete: () => {
    set({
      stage: "complete",
    });
  },

  reset: () => {
    set({
      stage: "loading",
    });
  },
}));
