import { Application, Container } from "pixi.js";

import { GAME_CONFIG } from "./game-config";

import { AudioManager } from "../audio/audio-manager";

import type { ILocation } from "../world/location";

import { createIsometricGrid } from "../world/create-isometric-grid";
import { createWorldObjectView } from "../world/create-world-object-view";
import { WorldObjectController } from "../world/world-object-controller";
import { getIsoDepth } from "../world/depth";

import { createPlayer } from "../entities/create-player";
import { PlayerController } from "../entities/player-controller";

import type { TPlayerDirection } from "../entities/player-direction";

import { KeyboardController } from "../input/keyboard-controller";

import { InteractionSystem } from "../interaction/interaction-system";

import { CollisionSystem } from "../systems/collision-system";

import { InventoryController } from "../inventory/inventory-controller";

import { gameEventBus } from "../events/game-event-bus";

export class GameEngine {
  private app: Application | null = null;
  private world: Container | null = null;
  private entities: Container | null = null;

  private player: PlayerController | null = null;
  private keyboard: KeyboardController | null = null;

  private collisionSystem: CollisionSystem | null = null;
  private interactionSystem: InteractionSystem | null = null;

  private audioManager: AudioManager | null = null;
  private inventory: InventoryController | null = null;

  private objectControllers = new Map<string, WorldObjectController>();

  private removeInteractionHandler: (() => void) | null = null;
  private removeInventoryHandler: (() => void) | null = null;

  async mount(element: HTMLElement, location: ILocation) {
    const app = new Application();

    await app.init({
      resizeTo: element,
      background: "#111318",
      antialias: true,
    });

    element.appendChild(app.canvas);

    const world = new Container();

    const grid = createIsometricGrid(location);

    const entities = new Container();

    entities.sortableChildren = true;

    location.objects.forEach((object) => {
      const view = createWorldObjectView(object);

      const controller = new WorldObjectController({
        object,
        view,
      });

      this.objectControllers.set(object.id, controller);

      entities.addChild(view.container);
    });

    const playerView = createPlayer({
      x: location.spawn.x,
      y: location.spawn.y,
    });

    playerView.zIndex = getIsoDepth(location.spawn.x, location.spawn.y);

    const player = new PlayerController({
      view: playerView,
      position: {
        x: location.spawn.x,
        y: location.spawn.y,
      },
    });

    entities.addChild(playerView);

    const keyboard = new KeyboardController();

    const collisionSystem = new CollisionSystem(location);
    const interactionSystem = new InteractionSystem(location);

    const audioManager = new AudioManager();
    const inventory = new InventoryController();

    const removeInteractionHandler = keyboard.onKeyDown((key) => {
      if (key !== "KeyE") {
        return;
      }

      if (player.isMoving()) {
        return;
      }

      const object = interactionSystem.getInteractiveObjectInFront(
        player.getPosition(),
        player.getDirection(),
      );

      if (!object) {
        return;
      }

      const controller = this.objectControllers.get(object.id);

      if (!controller) {
        return;
      }

      switch (object.interactionAction) {
        case "open-container": {
          const didOpen = controller.open();

          if (didOpen) {
            audioManager.playSfx("chest-open");
          }

          if (!controller.isEmpty()) {
            const contents = controller.takeAllContents();

            inventory.addItems(contents);

            gameEventBus.emit("inventory-updated", inventory.getItems());
          }

          break;
        }

        case "talk":
          break;

        case "transition":
          break;

        case "inspect":
          break;
      }
    });

    const removeInventoryHandler = keyboard.onKeyDown((key) => {
      if (key !== "KeyI") {
        return;
      }

      gameEventBus.emit("inventory-toggle");
    });

    keyboard.mount();

    world.addChild(grid);
    world.addChild(entities);

    world.position.set(app.screen.width / 2, app.screen.height / 4);

    app.stage.addChild(world);

    this.app = app;
    this.world = world;
    this.entities = entities;

    this.player = player;
    this.keyboard = keyboard;

    this.collisionSystem = collisionSystem;
    this.interactionSystem = interactionSystem;

    this.audioManager = audioManager;
    this.inventory = inventory;

    this.removeInteractionHandler = removeInteractionHandler;

    this.removeInventoryHandler = removeInventoryHandler;

    app.ticker.add((ticker) => {
      player.update(ticker.deltaMS, GAME_CONFIG.player.moveSpeed);

      this.updateMovement(player, keyboard);
    });
  }

  private updateMovement(
    player: PlayerController,
    keyboard: KeyboardController,
  ) {
    if (player.isMoving()) {
      return;
    }

    const direction = this.getMovementDirection(keyboard);

    if (!direction) {
      return;
    }

    player.setDirection(direction.direction);

    const position = player.getPosition();

    this.movePlayer(player, position.x + direction.x, position.y + direction.y);
  }

  private getMovementDirection(keyboard: KeyboardController): {
    x: number;
    y: number;
    direction: TPlayerDirection;
  } | null {
    if (keyboard.isPressed("KeyW") || keyboard.isPressed("ArrowUp")) {
      return {
        x: -1,
        y: -1,
        direction: "up",
      };
    }

    if (keyboard.isPressed("KeyS") || keyboard.isPressed("ArrowDown")) {
      return {
        x: 1,
        y: 1,
        direction: "down",
      };
    }

    if (keyboard.isPressed("KeyA") || keyboard.isPressed("ArrowLeft")) {
      return {
        x: -1,
        y: 1,
        direction: "left",
      };
    }

    if (keyboard.isPressed("KeyD") || keyboard.isPressed("ArrowRight")) {
      return {
        x: 1,
        y: -1,
        direction: "right",
      };
    }

    return null;
  }

  private movePlayer(player: PlayerController, x: number, y: number) {
    if (!this.collisionSystem?.canMoveTo(x, y)) {
      return;
    }

    player.moveTo(x, y);
  }

  destroy() {
    this.removeInteractionHandler?.();
    this.removeInventoryHandler?.();

    this.keyboard?.destroy();
    this.audioManager?.destroy();

    this.app?.destroy(true);

    this.app = null;
    this.world = null;
    this.entities = null;

    this.player = null;
    this.keyboard = null;

    this.collisionSystem = null;
    this.interactionSystem = null;

    this.audioManager = null;
    this.inventory = null;

    this.objectControllers.clear();

    this.removeInteractionHandler = null;
    this.removeInventoryHandler = null;
  }
}
