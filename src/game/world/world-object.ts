import type { TInteractionAction } from "../interaction/interaction-action";
import type { TContainerContent } from "../inventory/container-content";

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

interface IBaseInteractiveWorldObject extends IBaseWorldObject {
  type: "interactive";
}

export interface IContainerWorldObject extends IBaseInteractiveWorldObject {
  interactionAction: "open-container";

  contents: TContainerContent;
}

export interface ITalkWorldObject extends IBaseInteractiveWorldObject {
  interactionAction: "talk";

  npcId: string;
}

export interface ITransitionWorldObject extends IBaseInteractiveWorldObject {
  interactionAction: "transition";
}

export interface IInspectWorldObject extends IBaseInteractiveWorldObject {
  interactionAction: "inspect";
}

export type IInteractiveWorldObject =
  | IContainerWorldObject
  | ITalkWorldObject
  | ITransitionWorldObject
  | IInspectWorldObject;

export type IWorldObject =
  | IDecorationWorldObject
  | IObstacleWorldObject
  | IInteractiveWorldObject;

export type { TInteractionAction };
