import { Container, Graphics } from "pixi.js";

import { GAME_CONFIG } from "../core/game-config";

import { createFloorTileView } from "./create-floor-tile-view";
import { resolveFloorLayers } from "./resolve-floor-layers";

import type { ILocation } from "./location";

import { worldToIso } from "./iso";

export async function createIsometricGrid(location: ILocation) {
  const container = new Container();

  const tilePromises: Promise<void>[] = [];

  for (let x = 0; x < location.width; x += 1) {
    for (let y = 0; y < location.height; y += 1) {
      tilePromises.push(createTile(container, location, x, y));
    }
  }

  await Promise.all(tilePromises);

  return container;
}

async function createTile(
  container: Container,
  location: ILocation,
  x: number,
  y: number,
) {
  const position = worldToIso(x, y);

  const tileContainer = new Container();

  tileContainer.position.set(position.x, position.y);

  if (!location.floor) {
    tileContainer.addChild(createFallbackTile());

    container.addChild(tileContainer);

    return;
  }

  const layers = resolveFloorLayers(
    location.floor,
    x,
    y,
    location.width,
    location.height,
  );

  for (let index = 0; index < layers.length; index += 1) {
    const layer = layers[index];

    try {
      const layerView = await createFloorTileView({
        textureConfig: layer.texture,

        x: layer.regionX,

        y: layer.regionY,

        floorWidth: layer.regionWidth,

        floorHeight: layer.regionHeight,
      });

      tileContainer.addChild(layerView);
    } catch (error) {
      console.error(
        `[Floor] Failed to load texture "${layer.texture.src}"`,
        error,
      );

      if (index === 0) {
        tileContainer.addChild(createFallbackTile());
      }
    }
  }

  container.addChild(tileContainer);
}

function createFallbackTile() {
  const halfWidth = GAME_CONFIG.tile.width / 2;

  const halfHeight = GAME_CONFIG.tile.height / 2;

  return new Graphics()
    .moveTo(0, -halfHeight)
    .lineTo(halfWidth, 0)
    .lineTo(0, halfHeight)
    .lineTo(-halfWidth, 0)
    .closePath()
    .fill({
      color: 0x252830,
    })
    .stroke({
      width: 1,
      color: 0x343842,
      alpha: 0.5,
    });
}
