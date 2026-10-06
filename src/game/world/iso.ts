import { GAME_CONFIG } from "../core/game-config";

interface IPoint {
  x: number;
  y: number;
}

export function worldToIso(x: number, y: number): IPoint {
  const { width, height } = GAME_CONFIG.tile;

  return {
    x: (x - y) * (width / 2),
    y: (x + y) * (height / 2),
  };
}

export function isoToWorld(x: number, y: number): IPoint {
  const { width, height } = GAME_CONFIG.tile;

  return {
    x: x / width + y / height,
    y: y / height - x / width,
  };
}
