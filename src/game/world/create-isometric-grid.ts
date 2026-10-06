import { Container, Graphics } from "pixi.js";

import { GAME_CONFIG } from "../core/game-config";

import type { ILocation } from "./location";

import { worldToIso } from "./iso";

export function createIsometricGrid(location: ILocation) {
  const container = new Container();

  const { width: tileWidth, height: tileHeight } = GAME_CONFIG.tile;

  for (let y = 0; y < location.height; y += 1) {
    for (let x = 0; x < location.width; x += 1) {
      const position = worldToIso(x, y);

      const isBlocked = location.blockedTiles.some(
        (tile) => tile.x === x && tile.y === y,
      );

      const tile = new Graphics()
        .poly([
          0,
          -tileHeight / 2,

          tileWidth / 2,
          0,

          0,
          tileHeight / 2,

          -tileWidth / 2,
          0,
        ])
        .fill({
          color: isBlocked ? 0x5a2f2f : 0x30343b,
        })
        .stroke({
          width: 1,
          color: isBlocked ? 0x9a5555 : 0x5d626b,
        });

      tile.position.set(position.x, position.y);

      container.addChild(tile);
    }
  }

  return container;
}
