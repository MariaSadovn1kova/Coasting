import type { IGridPosition } from "./grid-position";

export type TWallSide = "left" | "right";

export interface IWall {
  id: string;

  position: IGridPosition;

  side: TWallSide;

  height?: number;

  blocksMovement?: boolean;
}
