import type { TInteractionAction } from "../interaction/interaction-action";
import type { TContainerContent } from "../inventory/container-content";
import type { IItem } from "../inventory/item";

import type { TGameEffect } from "../effects/game-effect";

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

export interface IPickupWorldObject extends IBaseInteractiveWorldObject {
  interactionAction: "pickup";

  item: IItem;

  quantity?: number;

  effects?: TGameEffect[];
}

export interface ITalkWorldObject extends IBaseInteractiveWorldObject {
  interactionAction: "talk";

  npcId: string;
}

export interface ITransitionWorldObject extends IBaseInteractiveWorldObject {
  interactionAction: "transition";

  wallSide: "left" | "right";

  targetLocationId: string;

  targetPosition: IGridPosition;
}

export interface IInspectWorldObject extends IBaseInteractiveWorldObject {
  interactionAction: "inspect";
}

export type IInteractiveWorldObject =
  | IContainerWorldObject
  | IPickupWorldObject
  | ITalkWorldObject
  | ITransitionWorldObject
  | IInspectWorldObject;

export type IWorldObject =
  | IDecorationWorldObject
  | IObstacleWorldObject
  | IInteractiveWorldObject;

export type { TInteractionAction };
