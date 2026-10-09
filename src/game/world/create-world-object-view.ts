import { Container, Graphics } from "pixi.js";

import { getIsoDepth } from "./depth";
import { worldToIso } from "./iso";

import type { IWorldObject } from "./world-object";

export interface IWorldObjectView {
  container: Container;

  setOpen: (isOpen: boolean) => void;
}

export function createWorldObjectView(object: IWorldObject): IWorldObjectView {
  if (object.type === "interactive" && object.interactionAction === "talk") {
    return createNpcView(object);
  }

  if (
    object.type === "interactive" &&
    object.interactionAction === "open-container"
  ) {
    return createContainerView(object);
  }

  return createDefaultObjectView(object);
}

function createNpcView(object: IWorldObject): IWorldObjectView {
  const container = new Container();

  const shadow = new Graphics().ellipse(0, 0, 20, 7).fill({
    color: 0x000000,
    alpha: 0.3,
  });

  const body = new Graphics()
    .roundRect(-11, -38, 22, 36, 7)
    .fill({
      color: 0x8c7ac8,
    })
    .stroke({
      width: 2,
      color: 0xbcaee8,
    });

  const head = new Graphics()
    .circle(0, -48, 10)
    .fill({
      color: 0xe8d6c5,
    })
    .stroke({
      width: 2,
      color: 0xf2e5d8,
    });

  container.addChild(shadow);

  container.addChild(body);

  container.addChild(head);

  applyObjectPosition(container, object);

  return {
    container,

    setOpen: () => {
      // NPC не имеет состояния открытия.
    },
  };
}

function createContainerView(object: IWorldObject): IWorldObjectView {
  const container = new Container();

  const shadow = new Graphics().ellipse(0, 0, 24, 8).fill({
    color: 0x000000,
    alpha: 0.3,
  });

  const body = new Graphics()
    .roundRect(-18, -28, 36, 28, 4)
    .fill({
      color: 0x8b5a2b,
    })
    .stroke({
      width: 2,
      color: 0xc58a4a,
    });

  const lid = new Graphics()
    .roundRect(-20, -34, 40, 10, 4)
    .fill({
      color: 0x6f451f,
    })
    .stroke({
      width: 2,
      color: 0xc58a4a,
    });

  const lock = new Graphics().roundRect(-4, -24, 8, 10, 2).fill({
    color: 0xd5b45b,
  });

  container.addChild(shadow);

  container.addChild(body);

  container.addChild(lid);

  container.addChild(lock);

  applyObjectPosition(container, object);

  const setOpen = (isOpen: boolean) => {
    if (isOpen) {
      lid.position.set(0, -12);

      lid.angle = -10;

      lock.visible = false;

      return;
    }

    lid.position.set(0, 0);

    lid.angle = 0;

    lock.visible = true;
  };

  setOpen(false);

  return {
    container,
    setOpen,
  };
}

function createDefaultObjectView(object: IWorldObject): IWorldObjectView {
  const container = new Container();

  const shadow = new Graphics().ellipse(0, 0, 20, 7).fill({
    color: 0x000000,
    alpha: 0.3,
  });

  const body = new Graphics().rect(-16, -24, 32, 24).fill({
    color: 0x666666,
  });

  container.addChild(shadow);

  container.addChild(body);

  applyObjectPosition(container, object);

  return {
    container,

    setOpen: () => {
      // Обычные объекты не открываются.
    },
  };
}

function applyObjectPosition(container: Container, object: IWorldObject) {
  const position = worldToIso(object.position.x, object.position.y);

  container.position.set(position.x, position.y);

  container.zIndex = getIsoDepth(object.position.x, object.position.y);
}
