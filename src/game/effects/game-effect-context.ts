import type { TGameFactValue } from "../facts/game-fact";

export interface IGameEffectContext {
  setFact: (key: string, value: TGameFactValue) => void;

  changeRelationship: (npcId: string, amount: number) => void;

  addItem: (itemId: string, quantity: number) => void;

  removeItem: (itemId: string, quantity: number) => void;
}
