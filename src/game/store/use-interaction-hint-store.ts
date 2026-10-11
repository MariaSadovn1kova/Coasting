import { create } from "zustand";

export type TInteractionHintAction = "talk" | "open" | "enter" | "inspect";

interface IInteractionHintStore {
  isVisible: boolean;

  action: TInteractionHintAction | null;

  show: (action: TInteractionHintAction) => void;

  hide: () => void;
}

export const useInteractionHintStore = create<IInteractionHintStore>((set) => ({
  isVisible: false,

  action: null,

  show: (action) => {
    set({
      isVisible: true,
      action,
    });
  },

  hide: () => {
    set({
      isVisible: false,
      action: null,
    });
  },
}));
