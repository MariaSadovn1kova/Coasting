import type { IFloorConfig } from "./floor";
import type { IGridPosition } from "./grid-position";
import type { IWall } from "./wall";
import type { IWorldObject } from "./world-object";

export interface ILocation {
  id: string;

  nameKey: string;

  width: number;
  height: number;

  spawn: IGridPosition;

  blockedTiles: IGridPosition[];

  objects: IWorldObject[];

  walls?: IWall[];

  floor?: IFloorConfig;
}
