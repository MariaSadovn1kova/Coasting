import type { ILocation } from "../world/location";

export class CollisionSystem {
  private location: ILocation;

  constructor(location: ILocation) {
    this.location = location;
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
