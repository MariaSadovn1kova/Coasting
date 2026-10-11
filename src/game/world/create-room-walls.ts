import type { IWall, TWallSide } from "./wall";

interface IRoomWallOpening {
  side: TWallSide;
  index: number;
}

interface ICreateRoomWallsOptions {
  width: number;
  height: number;

  wallHeight?: number;

  openings?: IRoomWallOpening[];
}

export function createRoomWalls({
  width,
  height,
  wallHeight = 64,
  openings = [],
}: ICreateRoomWallsOptions): IWall[] {
  const hasOpening = (side: TWallSide, index: number) =>
    openings.some(
      (opening) => opening.side === side && opening.index === index,
    );

  const leftWalls = Array.from(
    { length: height },
    (_, y): IWall => ({
      id: `left-wall-${y}`,

      position: {
        x: 0,
        y,
      },

      side: "left",

      height: wallHeight,

      blocksMovement: true,
    }),
  ).filter((_, y) => !hasOpening("left", y));

  const rightWalls = Array.from(
    { length: width },
    (_, x): IWall => ({
      id: `right-wall-${x}`,

      position: {
        x,
        y: 0,
      },

      side: "right",

      height: wallHeight,

      blocksMovement: true,
    }),
  ).filter((_, x) => !hasOpening("right", x));

  return [...leftWalls, ...rightWalls];
}
