import type { Container } from "pixi.js";

import type { TPlayerDirection } from "./player-direction";

import { getIsoDepth } from "../world/depth";
import { worldToIso } from "../world/iso";

interface IPlayerPosition {
  x: number;
  y: number;
}

interface IPlayerControllerParams {
  view: Container;
  position: IPlayerPosition;
  direction?: TPlayerDirection;
}

export class PlayerController {
  private view: Container;

  private position: IPlayerPosition;

  private direction: TPlayerDirection;

  private movementStart: IPlayerPosition;
  private movementTarget: IPlayerPosition;

  private movementProgress = 1;

  constructor({ view, position, direction = "down" }: IPlayerControllerParams) {
    this.view = view;

    this.position = {
      x: position.x,
      y: position.y,
    };

    this.direction = direction;

    this.movementStart = {
      ...this.position,
    };

    this.movementTarget = {
      ...this.position,
    };

    this.updateViewPosition(this.position);
  }

  getPosition() {
    return {
      ...this.position,
    };
  }

  getDirection() {
    return this.direction;
  }

  setDirection(direction: TPlayerDirection) {
    this.direction = direction;
  }

  isMoving() {
    return this.movementProgress < 1;
  }

  setPosition(x: number, y: number) {
    this.position = {
      x,
      y,
    };

    this.movementStart = {
      x,
      y,
    };

    this.movementTarget = {
      x,
      y,
    };

    this.movementProgress = 1;

    this.updateViewPosition(this.position);
  }

  moveTo(x: number, y: number) {
    if (this.isMoving()) {
      return;
    }

    this.movementStart = {
      ...this.position,
    };

    this.movementTarget = {
      x,
      y,
    };

    this.movementProgress = 0;
  }

  update(deltaMs: number, moveSpeed: number) {
    if (!this.isMoving()) {
      return;
    }

    const movementDuration = 1000 / moveSpeed;

    this.movementProgress += deltaMs / movementDuration;

    const progress = Math.min(this.movementProgress, 1);

    const x =
      this.movementStart.x +
      (this.movementTarget.x - this.movementStart.x) * progress;

    const y =
      this.movementStart.y +
      (this.movementTarget.y - this.movementStart.y) * progress;

    this.updateViewPosition({
      x,
      y,
    });

    if (progress === 1) {
      this.position = {
        ...this.movementTarget,
      };

      this.movementProgress = 1;
    }
  }

  private updateViewPosition(position: IPlayerPosition) {
    const isoPosition = worldToIso(position.x, position.y);

    this.view.position.set(isoPosition.x, isoPosition.y);

    this.view.zIndex = getIsoDepth(position.x, position.y);
  }
}
