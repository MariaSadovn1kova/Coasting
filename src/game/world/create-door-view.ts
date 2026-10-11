import { Container, Graphics } from "pixi.js";

import { GAME_CONFIG } from "../core/game-config";

import type { ITransitionWorldObject } from "./world-object";

interface ICreateDoorViewOptions {
  object: ITransitionWorldObject;

  wallHeight?: number;
}

export function createDoorView({
  object,
  wallHeight = 64,
}: ICreateDoorViewOptions) {
  const container = new Container();

  const graphics = new Graphics();

  const halfWidth = GAME_CONFIG.tile.width / 2;

  const halfHeight = GAME_CONFIG.tile.height / 2;

  const doorHeight = wallHeight - 10;

  if (object.wallSide === "left") {
    graphics
      .moveTo(0, -halfHeight)
      .lineTo(-halfWidth, 0)
      .lineTo(-halfWidth, -doorHeight)
      .lineTo(0, -halfHeight - doorHeight)
      .closePath()
      .fill({
        color: 0x242732,
      });

    graphics
      .moveTo(-4, -halfHeight - 5)
      .lineTo(-halfWidth + 4, -2)
      .lineTo(-halfWidth + 4, -doorHeight + 4)
      .lineTo(-4, -halfHeight - doorHeight + 5)
      .closePath()
      .fill({
        color: 0x444957,
      });

    graphics.circle(-halfWidth * 0.65, -doorHeight * 0.42, 2).fill({
      color: 0xb8a36d,
    });
  }

  if (object.wallSide === "right") {
    graphics
      .moveTo(0, -halfHeight)
      .lineTo(halfWidth, 0)
      .lineTo(halfWidth, -doorHeight)
      .lineTo(0, -halfHeight - doorHeight)
      .closePath()
      .fill({
        color: 0x2d303b,
      });

    graphics
      .moveTo(4, -halfHeight - 5)
      .lineTo(halfWidth - 4, -2)
      .lineTo(halfWidth - 4, -doorHeight + 4)
      .lineTo(4, -halfHeight - doorHeight + 5)
      .closePath()
      .fill({
        color: 0x505666,
      });

    graphics.circle(halfWidth * 0.65, -doorHeight * 0.42, 2).fill({
      color: 0xb8a36d,
    });
  }

  container.addChild(graphics);

  return container;
}
