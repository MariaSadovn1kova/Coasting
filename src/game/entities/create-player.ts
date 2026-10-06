import { Container, Graphics } from "pixi.js";

import { worldToIso } from "../world/iso";

interface ICreatePlayerParams {
  x: number;
  y: number;
}

export function createPlayer({ x, y }: ICreatePlayerParams) {
  const container = new Container();

  const shadow = new Graphics().ellipse(0, 0, 22, 8).fill({
    color: 0x000000,
    alpha: 0.35,
  });

  const body = new Graphics()
    .roundRect(-12, -38, 24, 38, 8)
    .fill({
      color: 0xd9d9d9,
    })
    .stroke({
      width: 2,
      color: 0xffffff,
    });

  const head = new Graphics()
    .circle(0, -48, 10)
    .fill({
      color: 0xf0f0f0,
    })
    .stroke({
      width: 2,
      color: 0xffffff,
    });

  container.addChild(shadow);
  container.addChild(body);
  container.addChild(head);

  const position = worldToIso(x, y);

  container.position.set(position.x, position.y);

  return container;
}
