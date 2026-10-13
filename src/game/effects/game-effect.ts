import type { TGameFactValue } from "../facts/game-fact";

export interface ISetFactGameEffect {
  type: "set-fact";

  key: string;

  value: TGameFactValue;
}

export interface IChangeRelationshipGameEffect {
  type: "change-relationship";

  npcId: string;

  amount: number;
}

export interface IAddItemGameEffect {
  type: "add-item";

  itemId: string;

  quantity?: number;
}

export interface IRemoveItemGameEffect {
  type: "remove-item";

  itemId: string;

  quantity?: number;
}

export type TGameEffect =
  | ISetFactGameEffect
  | IChangeRelationshipGameEffect
  | IAddItemGameEffect
  | IRemoveItemGameEffect;
