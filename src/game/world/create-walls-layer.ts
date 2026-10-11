import { Container } from "pixi.js";

import type { ILocation } from "./location";

import { worldToIso } from "./iso";
import { createWallView } from "./create-wall-view";
import { getIsoDepth } from "./depth";

export function createWallsLayer(location: ILocation) {
  const container = new Container();

  container.sortableChildren = true;

  location.walls?.forEach((wall) => {
    const isoPosition = worldToIso(wall.position.x, wall.position.y);

    const view = createWallView({
      wall,
      isoX: isoPosition.x,
      isoY: isoPosition.y,
    });

    view.zIndex = getIsoDepth(wall.position.x, wall.position.y);

    container.addChild(view);
  });

  return container;
}
