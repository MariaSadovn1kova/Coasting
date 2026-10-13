import type { TGameFactValue } from "../facts/game-fact";

export interface IGameConditionContext {
  getFact: (key: string) => TGameFactValue | undefined;

  getItemQuantity: (itemId: string) => number;

  getRelationship: (npcId: string) => number | undefined;
}
