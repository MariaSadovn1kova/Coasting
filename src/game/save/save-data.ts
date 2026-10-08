import type { IGridPosition } from "../world/grid-position";
import type { IWorldRuntimeState } from "../world/world-state";

export interface IInventorySaveItem {
  itemId: string;
  quantity: number;
}

export interface IPlayerSaveData {
  locationId: string;
  position: IGridPosition;
}

export interface ISaveData {
  version: number;

  createdAt: string;
  updatedAt: string;

  player: IPlayerSaveData;

  inventory: IInventorySaveItem[];

  world: IWorldRuntimeState;
}
