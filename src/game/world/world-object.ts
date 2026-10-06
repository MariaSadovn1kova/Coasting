import type { TInteractionAction } from "../interaction/interaction-action";

import type { IGridPosition } from "./grid-position";

export type TWorldObjectType = "decoration" | "obstacle" | "interactive";

interface IBaseWorldObject {
  id: string;
  position: IGridPosition;
  blocksMovement: boolean;
}

export interface IDecorationWorldObject extends IBaseWorldObject {
  type: "decoration";
}

export interface IObstacleWorldObject extends IBaseWorldObject {
  type: "obstacle";
}

export interface IInteractiveWorldObject extends IBaseWorldObject {
  type: "interactive";
  interactionAction: TInteractionAction;
}

export type IWorldObject =
  | IDecorationWorldObject
  | IObstacleWorldObject
  | IInteractiveWorldObject;
