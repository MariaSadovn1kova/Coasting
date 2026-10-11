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

    const hasWall = (x: number, y: number, side: "left" | "right") =>
      walls.some(
        (wall) =>
          wall.position.x === x && wall.position.y === y && wall.side === side,
      );

    const deltaX = toX - fromX;
    const deltaY = toY - fromY;

    if (deltaX === -1 && deltaY === -1) {
      return hasWall(fromX, fromY, "left") || hasWall(fromX, fromY, "right");
    }

    if (deltaX === 1 && deltaY === 1) {
      return hasWall(toX, toY, "left") || hasWall(toX, toY, "right");
    }

    if (deltaX === -1 && deltaY === 1) {
      return hasWall(fromX, fromY, "left") || hasWall(toX, toY, "right");
    }

    if (deltaX === 1 && deltaY === -1) {
      return hasWall(fromX, fromY, "right") || hasWall(toX, toY, "left");
    }

    return false;
  }

  canMove(fromX: number, fromY: number, toX: number, toY: number) {
    if (!this.canMoveTo(toX, toY)) {
      return false;
    }

    return !this.isWallBlockingMove(fromX, fromY, toX, toY);
  }

  canMoveTo(x: number, y: number) {
    if (this.isOutsideLocation(x, y)) {
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

  private isOutsideLocation(x: number, y: number) {
    return (
      x < 0 || y < 0 || x >= this.location.width || y >= this.location.height
    );
  }

  private isBlockedTile(x: number, y: number) {
    return this.location.blockedTiles.some(
      (tile) => tile.x === x && tile.y === y,
    );
  }

  private isBlockedByObject(x: number, y: number) {
    return this.location.objects.some(
      (object) =>
        object.blocksMovement &&
        object.position.x === x &&
        object.position.y === y,
    );
  }
}
