import type { IGridPosition } from "./grid-position";

export type TFloorTextureMode = "tile" | "continuous";

export type TFloorBlendMode = "normal" | "multiply" | "screen" | "add";

export interface IFloorTexture {
  src: string;

  mode?: TFloorTextureMode;

  scale?: number;

  rotation?: number;

  offsetX?: number;
  offsetY?: number;

  repeatX?: number;
  repeatY?: number;

  alpha?: number;

  blendMode?: TFloorBlendMode;
}

export interface IFloorRegion {
  from: IGridPosition;
  to: IGridPosition;

  texture: IFloorTexture;
}

export interface IFloorTile {
  position: IGridPosition;

  texture: IFloorTexture;
}

export interface IFloorLayer {
  id: string;

  texture?: IFloorTexture;

  regions?: IFloorRegion[];

  tiles?: IFloorTile[];
}

export interface IFloorConfig {
  base: IFloorTexture;

  blendMode?: TFloorBlendMode;

  layers?: IFloorLayer[];
}
