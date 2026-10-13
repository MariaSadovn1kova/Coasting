import { GAME_CONFIG } from "../core/game-config";

import type { IGridPosition } from "../world/grid-position";
import type { ILocation } from "../world/location";

import { CollisionSystem } from "./collision-system";

interface IPathNode extends IGridPosition {
  g: number;
  h: number;
  f: number;
}

const TARGET_DISTANCE = 1;

export class PathfindingSystem {
  constructor(
    private readonly location: ILocation,
    private readonly collisionSystem: CollisionSystem,
  ) {}

  findPathToTarget(
    start: IGridPosition,
    target: IGridPosition,
    targetDistance = TARGET_DISTANCE,
  ): IGridPosition[] | null {
    if (this.getDistance(start, target) <= targetDistance) {
      return [];
    }

    const startPosition = this.normalizePosition(start);

    const openNodes = new Map<string, IPathNode>();

    const closedNodes = new Set<string>();

    const cameFrom = new Map<string, string>();

    const positions = new Map<string, IGridPosition>();

    const startKey = this.getPositionKey(startPosition);

    const startNode: IPathNode = {
      ...startPosition,

      g: 0,

      h: this.getDistance(startPosition, target),

      f: this.getDistance(startPosition, target),
    };

    openNodes.set(startKey, startNode);

    positions.set(startKey, startPosition);

    while (openNodes.size > 0) {
      const current = this.getLowestCostNode(openNodes);

      const currentKey = this.getPositionKey(current);

      openNodes.delete(currentKey);

      if (this.getDistance(current, target) <= targetDistance) {
        return this.reconstructPath(currentKey, startKey, cameFrom, positions);
      }

      closedNodes.add(currentKey);

      const neighbors = this.getNeighbors(current);

      neighbors.forEach((neighbor) => {
        const neighborKey = this.getPositionKey(neighbor);

        if (closedNodes.has(neighborKey)) {
          return;
        }

        if (!this.isInsideLocation(neighbor)) {
          return;
        }

        if (
          !this.collisionSystem.canMove(
            current.x,
            current.y,
            neighbor.x,
            neighbor.y,
          )
        ) {
          return;
        }

        const movementCost = this.getDistance(current, neighbor);

        const tentativeG = current.g + movementCost;

        const existingNode = openNodes.get(neighborKey);

        if (existingNode && tentativeG >= existingNode.g) {
          return;
        }

        const h = this.getDistance(neighbor, target);

        openNodes.set(neighborKey, {
          ...neighbor,

          g: tentativeG,

          h,

          f: tentativeG + h,
        });

        positions.set(neighborKey, neighbor);

        cameFrom.set(neighborKey, currentKey);
      });
    }

    return null;
  }

  private getNeighbors(position: IGridPosition): IGridPosition[] {
    const step = GAME_CONFIG.player.movementStep;

    return [
      // вертикаль экрана
      this.normalizePosition({
        x: position.x - step,
        y: position.y - step,
      }),

      this.normalizePosition({
        x: position.x + step,
        y: position.y + step,
      }),

      // горизонталь экрана
      this.normalizePosition({
        x: position.x - step,
        y: position.y + step,
      }),

      this.normalizePosition({
        x: position.x + step,
        y: position.y - step,
      }),

      // диагонали изометрического мира
      this.normalizePosition({
        x: position.x + step,
        y: position.y,
      }),

      this.normalizePosition({
        x: position.x - step,
        y: position.y,
      }),

      this.normalizePosition({
        x: position.x,
        y: position.y + step,
      }),

      this.normalizePosition({
        x: position.x,
        y: position.y - step,
      }),
    ];
  }

  private getLowestCostNode(nodes: Map<string, IPathNode>): IPathNode {
    let lowestNode: IPathNode | null = null;

    nodes.forEach((node) => {
      if (
        !lowestNode ||
        node.f < lowestNode.f ||
        (node.f === lowestNode.f && node.h < lowestNode.h)
      ) {
        lowestNode = node;
      }
    });

    return lowestNode!;
  }

  private reconstructPath(
    endKey: string,
    startKey: string,
    cameFrom: Map<string, string>,
    positions: Map<string, IGridPosition>,
  ): IGridPosition[] {
    const path: IGridPosition[] = [];

    let currentKey = endKey;

    while (currentKey !== startKey) {
      const position = positions.get(currentKey);

      if (!position) {
        break;
      }

      path.unshift(position);

      const previousKey = cameFrom.get(currentKey);

      if (!previousKey) {
        break;
      }

      currentKey = previousKey;
    }

    return path;
  }

  private getDistance(first: IGridPosition, second: IGridPosition) {
    return Math.hypot(second.x - first.x, second.y - first.y);
  }

  private normalizePosition(position: IGridPosition): IGridPosition {
    return {
      x: Math.round(position.x * 1000) / 1000,

      y: Math.round(position.y * 1000) / 1000,
    };
  }

  private getPositionKey(position: IGridPosition) {
    return `${position.x}:${position.y}`;
  }

  private isInsideLocation(position: IGridPosition) {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x < this.location.width &&
      position.y < this.location.height
    );
  }
}
