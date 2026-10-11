import type { TPlayerDirection } from "../entities/player-direction";

import type { IGridPosition } from "../world/grid-position";
import type { ILocation } from "../world/location";
import type { IInteractiveWorldObject } from "../world/world-object";

interface IDirectionVector {
  x: number;
  y: number;
}

const INTERACTION_RANGE = 1.6;
const INTERACTION_WIDTH = 0.75;

export class InteractionSystem {
  constructor(private readonly location: ILocation) {}

  getInteractiveObjectInFront(
    playerPosition: IGridPosition,
    direction: TPlayerDirection,
  ): IInteractiveWorldObject | null {
    const directionVector = this.getDirectionVector(direction);

    const interactiveObjects = this.location.objects.filter(
      (object): object is IInteractiveWorldObject =>
        object.type === "interactive",
    );

    let closestObject: IInteractiveWorldObject | null = null;

    let closestDistance = Number.POSITIVE_INFINITY;

    interactiveObjects.forEach((object) => {
      const relativeX = object.position.x - playerPosition.x;

      const relativeY = object.position.y - playerPosition.y;

      const forwardDistance =
        (relativeX * directionVector.x + relativeY * directionVector.y) / 2;

      if (forwardDistance <= 0 || forwardDistance > INTERACTION_RANGE) {
        return;
      }

      const lateralDistance = Math.abs(
        (relativeX * directionVector.y - relativeY * directionVector.x) / 2,
      );

      if (lateralDistance > INTERACTION_WIDTH) {
        return;
      }

      const distance = Math.hypot(relativeX, relativeY);

      if (distance < closestDistance) {
        closestDistance = distance;

        closestObject = object;
      }
    });

    return closestObject;
  }

  private getDirectionVector(direction: TPlayerDirection): IDirectionVector {
    switch (direction) {
      case "up":
        return {
          x: -1,
          y: -1,
        };

      case "down":
        return {
          x: 1,
          y: 1,
        };

      case "left":
        return {
          x: -1,
          y: 1,
        };

      case "right":
        return {
          x: 1,
          y: -1,
        };
    }
  }
}
