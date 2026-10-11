import { Graphics } from "pixi.js";

import { GAME_CONFIG } from "../core/game-config";

import type { IWall } from "./wall";

interface ICreateWallViewOptions {
  wall: IWall;

  isoX: number;
  isoY: number;
}

export function createWallView({ wall, isoX, isoY }: ICreateWallViewOptions) {
  const graphics = new Graphics();

  const halfWidth = GAME_CONFIG.tile.width / 2;

  const halfHeight = GAME_CONFIG.tile.height / 2;

  const wallHeight = wall.height ?? 64;

  const top = {
    x: isoX,
    y: isoY - halfHeight,
  };

  const left = {
    x: isoX - halfWidth,
    y: isoY,
  };

  const right = {
    x: isoX + halfWidth,
    y: isoY,
  };

  if (wall.side === "left") {
    graphics
      .moveTo(top.x, top.y)
      .lineTo(left.x, left.y)
      .lineTo(left.x, left.y - wallHeight)
      .lineTo(top.x, top.y - wallHeight)
      .closePath()
      .fill({
        color: 0x2a2d35,
      });
  }

  if (wall.side === "right") {
    graphics
      .moveTo(top.x, top.y)
      .lineTo(right.x, right.y)
      .lineTo(right.x, right.y - wallHeight)
      .lineTo(top.x, top.y - wallHeight)
      .closePath()
      .fill({
        color: 0x343844,
      });
  }

  return graphics;
}
