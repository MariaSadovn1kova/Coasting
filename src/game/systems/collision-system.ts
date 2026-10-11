import type { ILocation } from "../world/location";

export class CollisionSystem {
  private location: ILocation;

  constructor(location: ILocation) {
    this.location = location;
  }

  private isWallBlockingMove(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
  ) {
    const walls =
      this.location.walls?.filter((wall) => wall.blocksMovement !== false) ??
      [];

    return walls.some((wall) => {
      if (wall.side === "left") {
        const wallX = wall.position.x - 0.5;

        const wallMinY = wall.position.y - 0.5;

        const wallMaxY = wall.position.y + 0.5;

        const deltaX = toX - fromX;

        if (deltaX === 0) {
          return false;
        }

        const intersection = (wallX - fromX) / deltaX;

        if (intersection <= 0 || intersection > 1) {
          return false;
        }

        const intersectionY = fromY + (toY - fromY) * intersection;

        return intersectionY >= wallMinY && intersectionY <= wallMaxY;
      }

      if (wall.side === "right") {
        const wallY = wall.position.y - 0.5;

        const wallMinX = wall.position.x - 0.5;

        const wallMaxX = wall.position.x + 0.5;

        const deltaY = toY - fromY;

        if (deltaY === 0) {
          return false;
        }

        const intersection = (wallY - fromY) / deltaY;

        if (intersection <= 0 || intersection > 1) {
          return false;
        }

        const intersectionX = fromX + (toX - fromX) * intersection;

        return intersectionX >= wallMinX && intersectionX <= wallMaxX;
      }

      return false;
    });
  }

  canMove(fromX: number, fromY: number, toX: number, toY: number) {
    if (!this.canMoveTo(toX, toY)) {
      return false;
    }

    return !this.isWallBlockingMove(fromX, fromY, toX, toY);
  }

  private isInsideTile(x: number, y: number, tileX: number, tileY: number) {
    const halfSize = 0.5;

    return Math.abs(x - tileX) < halfSize && Math.abs(y - tileY) < halfSize;
  }

  private isInsideLocation(x: number, y: number) {
    return (
      x >= 0 &&
      y >= 0 &&
      x <= this.location.width - 1 &&
      y <= this.location.height - 1
    );
  }

  private isBlockedTile(x: number, y: number) {
    return this.location.blockedTiles.some((tile) =>
      this.isInsideTile(x, y, tile.x, tile.y),
    );
  }

  private isBlockedByObject(x: number, y: number) {
    return this.location.objects.some((object) => {
      if (!object.blocksMovement) {
        return false;
      }

      return this.isInsideTile(x, y, object.position.x, object.position.y);
    });
  }

  canMoveTo(x: number, y: number) {
    if (!this.isInsideLocation(x, y)) {
      return false;
    }

    if (this.isBlockedTile(x, y)) {
      return false;
    }

    if (this.isBlockedByObject(x, y)) {
      return false;
    }

    return true;
  }
}
