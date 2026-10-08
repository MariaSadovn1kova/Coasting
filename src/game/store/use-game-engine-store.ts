import { create } from "zustand";

import type { GameEngine } from "../core/game-engine";

interface IGameEngineStore {
  engine: GameEngine | null;

  setEngine: (engine: GameEngine | null) => void;
}

export const useGameEngineStore = create<IGameEngineStore>((set) => ({
  engine: null,

  setEngine: (engine) => {
    set({
      engine,
    });
  },
}));
