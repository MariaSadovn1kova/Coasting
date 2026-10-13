import type { TGameFactValue } from "../facts/game-fact";

export interface IFactGameCondition {
  type: "fact";

  key: string;

  equals?: TGameFactValue;
}

export interface IHasItemGameCondition {
  type: "has-item";

  itemId: string;

  quantity?: number;
}

export interface IRelationshipGameCondition {
  type: "relationship";

  npcId: string;

  min?: number;

  max?: number;
}

export type TGameCondition =
  | IFactGameCondition
  | IHasItemGameCondition
  | IRelationshipGameCondition;

export interface IGameConditionGroup {
  all?: TGameCondition[];

  any?: TGameCondition[];

  none?: TGameCondition[];
}
