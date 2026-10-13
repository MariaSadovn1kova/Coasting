import { create } from "zustand";

import type { TGameFacts, TGameFactValue } from "../facts/game-fact";

interface IGameFactsState {
  facts: TGameFacts;

  getFact: (key: string) => TGameFactValue | undefined;

  setFact: (key: string, value: TGameFactValue) => void;

  setFacts: (facts: TGameFacts) => void;

  clearFacts: () => void;
}

export const useGameFactsStore = create<IGameFactsState>((set, get) => ({
  facts: {},

  getFact: (key) => get().facts[key],

  setFact: (key, value) => {
    set((state) => ({
      facts: {
        ...state.facts,

        [key]: value,
      },
    }));
  },

  setFacts: (facts) => {
    set({
      facts: {
        ...facts,
      },
    });
  },

  clearFacts: () => {
    set({
      facts: {},
    });
  },
}));
