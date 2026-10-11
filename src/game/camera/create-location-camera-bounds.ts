import { GAME_CONFIG } from "../core/game-config";

import type { ILocation } from "../world/location";

import type { ICameraBounds } from "./camera-controller";

export function createLocationCameraBounds(location: ILocation): ICameraBounds {
  const halfWidth = GAME_CONFIG.tile.width / 2;

  const halfHeight = GAME_CONFIG.tile.height / 2;

  const maxWallHeight = Math.max(
    0,

    ...(location.walls ?? []).map((wall) => wall.height ?? 64),
  );

  return {
    minX: -location.height * halfWidth,

    maxX: location.width * halfWidth,

    minY: -halfHeight - maxWallHeight,

    maxY: (location.width + location.height - 1) * halfHeight,
  };
}
