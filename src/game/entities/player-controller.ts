import type { Container } from "pixi.js";

import { getIsoDepth } from "../world/depth";
import type { IGridPosition } from "../world/grid-position";
import { worldToIso } from "../world/iso";

import type { TPlayerDirection } from "./player-direction";

interface IPlayerControllerOptions {
  view: Container;
  position: IGridPosition;
}

export class PlayerController {
  private readonly view: Container;

  private position: IGridPosition;

  private startPosition: IGridPosition | null = null;

  private targetPosition: IGridPosition | null = null;

  private moveProgress = 0;

  private moveDistance = 0;

  private direction: TPlayerDirection = "down";

  constructor({ view, position }: IPlayerControllerOptions) {
    this.view = view;

    this.position = {
      ...position,
    };

    this.updateViewPosition(position.x, position.y);
  }

  getPosition(): IGridPosition {
    return {
      ...this.position,
    };
  }

  getDirection(): TPlayerDirection {
    return this.direction;
  }

  setDirection(direction: TPlayerDirection) {
    this.direction = direction;
  }

  isMoving() {
    return this.startPosition !== null && this.targetPosition !== null;
  }

  moveTo(x: number, y: number) {
    if (this.isMoving()) {
      return;
    }

    const distance = Math.hypot(x - this.position.x, y - this.position.y);

    if (distance <= 0) {
      return;
    }

    this.startPosition = {
      ...this.position,
    };

    this.targetPosition = {
      x,
      y,
    };

    this.moveProgress = 0;

    this.moveDistance = distance;
  }

  update(deltaMS: number, moveSpeed: number) {
    if (!this.startPosition || !this.targetPosition) {
      return;
    }

    if (this.moveDistance <= 0) {
      this.finishMovement();

      return;
    }

    this.moveProgress += ((deltaMS / 1000) * moveSpeed) / this.moveDistance;

    const progress = Math.min(this.moveProgress, 1);

    const x =
      this.startPosition.x +
      (this.targetPosition.x - this.startPosition.x) * progress;

    const y =
      this.startPosition.y +
      (this.targetPosition.y - this.startPosition.y) * progress;

    this.updateViewPosition(x, y);

    if (this.moveProgress >= 1) {
      this.finishMovement();
    }
  }

  setPosition(x: number, y: number) {
    this.position = {
      x,
      y,
    };

    this.startPosition = null;

    this.targetPosition = null;

    this.moveProgress = 0;

    this.moveDistance = 0;

    this.updateViewPosition(x, y);
  }

  private finishMovement() {
    if (!this.targetPosition) {
      return;
    }

    this.position = {
      ...this.targetPosition,
    };

    this.updateViewPosition(this.position.x, this.position.y);

    this.startPosition = null;

    this.targetPosition = null;

    this.moveProgress = 0;

    this.moveDistance = 0;
  }

  private updateViewPosition(x: number, y: number) {
    const isoPosition = worldToIso(x, y);

    this.view.position.set(isoPosition.x, isoPosition.y);

    this.view.zIndex = getIsoDepth(x, y);
  }
}
