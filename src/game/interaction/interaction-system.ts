import type { TPlayerDirection } from "../entities/player-direction";

import type { IGridPosition } from "../world/grid-position";
import type { ILocation } from "../world/location";
import type { IInteractiveWorldObject } from "../world/world-object";

export class InteractionSystem {
  private location: ILocation;

  constructor(location: ILocation) {
    this.location = location;
  }

  getInteractiveObjectInFront(
    position: IGridPosition,
    direction: TPlayerDirection,
  ): IInteractiveWorldObject | null {
    const targetPosition = this.getTargetPosition(position, direction);

    const object = this.location.objects.find(
      (item) =>
        item.type === "interactive" &&
        item.position.x === targetPosition.x &&
        item.position.y === targetPosition.y,
    );

    if (!object || object.type !== "interactive") {
      return null;
    }

    return object;
  }

  private getTargetPosition(
    position: IGridPosition,
    direction: TPlayerDirection,
  ): IGridPosition {
    switch (direction) {
      case "up":
        return {
          x: position.x - 1,
          y: position.y - 1,
        };

      case "down":
        return {
          x: position.x + 1,
          y: position.y + 1,
        };

      case "left":
        return {
          x: position.x - 1,
          y: position.y + 1,
        };

      case "right":
        return {
          x: position.x + 1,
          y: position.y - 1,
        };
    }
  }
}
