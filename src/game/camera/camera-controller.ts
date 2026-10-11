import type { Container } from "pixi.js";

export interface ICameraBounds {
  minX: number;
  maxX: number;

  minY: number;
  maxY: number;
}

interface ICameraControllerOptions {
  world: Container;

  viewportWidth: number;
  viewportHeight: number;

  zoom?: number;

  deadZoneWidth?: number;
  deadZoneHeight?: number;

  bounds?: ICameraBounds;
}

export class CameraController {
  private readonly world: Container;

  private readonly viewportWidth: number;
  private readonly viewportHeight: number;

  private readonly deadZoneWidth: number;
  private readonly deadZoneHeight: number;

  private readonly bounds?: ICameraBounds;

  private zoom: number;

  constructor({
    world,

    viewportWidth,
    viewportHeight,

    zoom = 1,

    deadZoneWidth = 400,
    deadZoneHeight = 240,

    bounds,
  }: ICameraControllerOptions) {
    this.world = world;

    this.viewportWidth = viewportWidth;

    this.viewportHeight = viewportHeight;

    this.deadZoneWidth = deadZoneWidth;

    this.deadZoneHeight = deadZoneHeight;

    this.bounds = bounds;

    this.zoom = zoom;

    this.applyZoom();
  }

  focusOn(x: number, y: number) {
    this.world.position.set(
      this.viewportWidth / 2 - x * this.zoom,

      this.viewportHeight / 2 - y * this.zoom,
    );

    this.clampToBounds();
  }

  update(targetX: number, targetY: number) {
    const screenX = this.world.position.x + targetX * this.zoom;

    const screenY = this.world.position.y + targetY * this.zoom;

    const left = this.viewportWidth / 2 - this.deadZoneWidth / 2;

    const right = this.viewportWidth / 2 + this.deadZoneWidth / 2;

    const top = this.viewportHeight / 2 - this.deadZoneHeight / 2;

    const bottom = this.viewportHeight / 2 + this.deadZoneHeight / 2;

    if (screenX < left) {
      this.world.position.x += left - screenX;
    }

    if (screenX > right) {
      this.world.position.x += right - screenX;
    }

    if (screenY < top) {
      this.world.position.y += top - screenY;
    }

    if (screenY > bottom) {
      this.world.position.y += bottom - screenY;
    }

    this.clampToBounds();
  }

  setZoom(zoom: number) {
    this.zoom = Math.max(0.1, zoom);

    this.applyZoom();

    this.clampToBounds();
  }

  getZoom() {
    return this.zoom;
  }

  private applyZoom() {
    this.world.scale.set(this.zoom);
  }

  private clampToBounds() {
    if (!this.bounds) {
      return;
    }

    const { minX, maxX, minY, maxY } = this.bounds;

    const scaledWidth = (maxX - minX) * this.zoom;

    const scaledHeight = (maxY - minY) * this.zoom;

    /*
     * Если локация меньше экрана —
     * просто держим её по центру.
     */

    if (scaledWidth <= this.viewportWidth) {
      const centerX = (minX + maxX) / 2;

      this.world.position.x = this.viewportWidth / 2 - centerX * this.zoom;
    } else {
      const minPositionX = this.viewportWidth - maxX * this.zoom;

      const maxPositionX = -minX * this.zoom;

      this.world.position.x = Math.max(
        minPositionX,

        Math.min(maxPositionX, this.world.position.x),
      );
    }

    if (scaledHeight <= this.viewportHeight) {
      const centerY = (minY + maxY) / 2;

      this.world.position.y = this.viewportHeight / 2 - centerY * this.zoom;
    } else {
      const minPositionY = this.viewportHeight - maxY * this.zoom;

      const maxPositionY = -minY * this.zoom;

      this.world.position.y = Math.max(
        minPositionY,

        Math.min(maxPositionY, this.world.position.y),
      );
    }
  }
}
