import { Application, Container } from "pixi.js";

import { GAME_CONFIG } from "./game-config";
import { gamePauseController } from "./game-pause-controller";

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

import { useWorldStateStore } from "../store/use-world-state-store";

import { SaveManager } from "../save/save-manager";
import type { ISaveData } from "../save/save-data";
import type { TSaveSlot } from "../save/save-slot";

import { getDialogueById } from "../../content/dialogues/dialogue-registry";
import { getNpcById } from "../../content/npcs/npc-registry";

import { DialogueController } from "../dialogue/dialogue-controller";

import { useDialogueStore } from "../store/use-dialogue-store";
import { useNpcStateStore } from "../store/use-npc-state-store";

import { NpcDialogueResolver } from "../npc/npc-dialogue-resolver";

export class GameEngine {
  private player: PlayerController | null = null;
  private inventory: InventoryController | null = null;

  private locationId: string | null = null;

  private saveManager = new SaveManager();

  private app: Application | null = null;

  private keyboard: KeyboardController | null = null;

  private collisionSystem: CollisionSystem | null = null;

  private audioManager: AudioManager | null = null;

  private objectControllers = new Map<string, WorldObjectController>();

  private removeInteractionHandler: (() => void) | null = null;

  private removeInventoryHandler: (() => void) | null = null;

  private removeEscapeHandler: (() => void) | null = null;

  private removeContainerTakeItemHandler: (() => void) | null = null;

  private removeContainerTakeAllHandler: (() => void) | null = null;

  private removeQuickSaveHandler: (() => void) | null = null;

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

    const worldState = useWorldStateStore.getState();

    location.objects.forEach((object) => {
      const view = createWorldObjectView(object);

      const runtimeState = worldState.getObjectState(location.id, object.id);

      const controller = new WorldObjectController({
        object,
        view,
        runtimeState,
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

      if (gamePauseController.isPaused()) {
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

            worldState.patchObjectState(location.id, object.id, {
              isOpen: true,
            });
          }

          gameEventBus.emit("container-opened", {
            containerId: object.id,
            items: controller.getContents(),
          });

          break;
        }

        case "talk": {
          const npc = getNpcById(object.npcId);

          if (!npc) {
            console.warn(`NPC not found: ${object.npcId}`);

            return;
          }

          const npcStateStore = useNpcStateStore.getState();

          npcStateStore.initializeNpc(npc.id, npc.initialRelationship);

          const npcState = npcStateStore.getNpcState(npc.id);

          if (!npcState) {
            return;
          }

          const dialogueResolver = new NpcDialogueResolver();

          const dialogueId = dialogueResolver.resolve(npc, npcState);

          const dialogue = getDialogueById(dialogueId);

          if (!dialogue) {
            console.warn(`Dialogue not found: ${dialogueId}`);

            return;
          }

          const dialogueController = new DialogueController({
            dialogue,
          });

          useDialogueStore
            .getState()
            .openDialogue(npc.id, dialogue.id, dialogueController);

          break;
        }

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

      if (gamePauseController.has("container")) {
        return;
      }

      gameEventBus.emit("inventory-toggle");
    });

    const removeEscapeHandler = keyboard.onKeyDown((key) => {
      if (key !== "Escape") {
        return;
      }

      if (gamePauseController.has("save-menu")) {
        gameEventBus.emit("save-menu-close");

        return;
      }

      if (gamePauseController.has("container")) {
        gameEventBus.emit("container-close");

        return;
      }

      if (gamePauseController.has("inventory")) {
        gameEventBus.emit("inventory-close");
      }
    });

    const removeQuickSaveHandler = keyboard.onKeyDown(async (key) => {
      if (key !== "F5") {
        return;
      }

      try {
        const saveData = await this.saveGame(1);

        if (!saveData) {
          console.warn("Game is not ready for saving");

          return;
        }

        console.log("Game saved to slot 1", saveData);
      } catch (error) {
        console.error("Failed to save game", error);
      }
    });

    const removeContainerTakeItemHandler = gameEventBus.on(
      "container-take-item",
      ({ containerId, itemId }) => {
        const controller = this.objectControllers.get(containerId);

        if (!controller) {
          return;
        }

        const item = controller.takeItem(itemId, 1);

        if (!item) {
          return;
        }

        inventory.addItem(item);

        const currentState = worldState.getObjectState(
          location.id,
          containerId,
        );

        const removedItemIds = currentState?.removedItemIds ?? [];

        if (
          controller.getContents().every((entry) => entry.item.id !== itemId)
        ) {
          worldState.patchObjectState(location.id, containerId, {
            removedItemIds: [...new Set([...removedItemIds, itemId])],
          });
        }

        gameEventBus.emit("inventory-updated", inventory.getItems());

        gameEventBus.emit("container-updated", controller.getContents());
      },
    );

    const removeContainerTakeAllHandler = gameEventBus.on(
      "container-take-all",
      ({ containerId }) => {
        const controller = this.objectControllers.get(containerId);

        if (!controller) {
          return;
        }

        const contents = controller.takeAllContents();

        if (contents.length === 0) {
          return;
        }

        inventory.addItems(contents);

        const currentState = worldState.getObjectState(
          location.id,
          containerId,
        );

        const removedItemIds = currentState?.removedItemIds ?? [];

        worldState.patchObjectState(location.id, containerId, {
          removedItemIds: [
            ...new Set([
              ...removedItemIds,
              ...contents.map((entry) => entry.item.id),
            ]),
          ],
        });

        gameEventBus.emit("inventory-updated", inventory.getItems());

        gameEventBus.emit("container-updated", controller.getContents());
      },
    );

    keyboard.mount();

    world.addChild(grid);
    world.addChild(entities);

    world.position.set(app.screen.width / 2, app.screen.height / 4);

    app.stage.addChild(world);

    this.app = app;

    this.player = player;
    this.keyboard = keyboard;

    this.collisionSystem = collisionSystem;

    this.audioManager = audioManager;

    this.inventory = inventory;

    this.locationId = location.id;

    this.removeInteractionHandler = removeInteractionHandler;

    this.removeInventoryHandler = removeInventoryHandler;

    this.removeEscapeHandler = removeEscapeHandler;

    this.removeQuickSaveHandler = removeQuickSaveHandler;

    this.removeContainerTakeItemHandler = removeContainerTakeItemHandler;

    this.removeContainerTakeAllHandler = removeContainerTakeAllHandler;

    app.ticker.add((ticker) => {
      if (gamePauseController.isPaused()) {
        return;
      }

      player.update(ticker.deltaMS, GAME_CONFIG.player.moveSpeed);

      this.updateMovement(player, keyboard);
    });
  }

  createSaveData(): ISaveData | null {
    if (!this.player || !this.inventory || !this.locationId) {
      return null;
    }

    return this.saveManager.createSaveData({
      locationId: this.locationId,

      playerPosition: this.player.getPosition(),

      inventory: this.inventory.getItems(),
    });
  }

  async saveGame(slot: TSaveSlot): Promise<ISaveData | null> {
    if (!this.player || !this.inventory || !this.locationId) {
      return null;
    }

    return this.saveManager.save(slot, {
      locationId: this.locationId,

      playerPosition: this.player.getPosition(),

      inventory: this.inventory.getItems(),
    });
  }

  async loadGame(slot: TSaveSlot): Promise<boolean> {
    if (!this.player || !this.inventory || !this.locationId) {
      return false;
    }

    const loadedGame = await this.saveManager.loadGame(slot);

    if (loadedGame.locationId !== this.locationId) {
      console.warn(
        `Cannot load location "${loadedGame.locationId}" while "${this.locationId}" is active`,
      );

      return false;
    }

    this.player.setPosition(
      loadedGame.playerPosition.x,
      loadedGame.playerPosition.y,
    );

    this.inventory.setItems(loadedGame.inventory);

    const worldState = useWorldStateStore.getState();

    this.objectControllers.forEach((controller, objectId) => {
      const runtimeState = worldState.getObjectState(
        this.locationId!,
        objectId,
      );

      controller.applyRuntimeState(runtimeState);
    });

    gameEventBus.emit("inventory-updated", this.inventory.getItems());

    gameEventBus.emit("container-close");

    gameEventBus.emit("inventory-close");

    return true;
  }

  private updateMovement(
    player: PlayerController,
    keyboard: KeyboardController,
  ) {
    if (gamePauseController.isPaused()) {
      return;
    }

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
    if (gamePauseController.isPaused()) {
      return;
    }

    if (!this.collisionSystem?.canMoveTo(x, y)) {
      return;
    }

    player.moveTo(x, y);
  }

  destroy() {
    this.removeInteractionHandler?.();
    this.removeInventoryHandler?.();
    this.removeEscapeHandler?.();
    this.removeQuickSaveHandler?.();

    this.removeContainerTakeItemHandler?.();
    this.removeContainerTakeAllHandler?.();

    this.keyboard?.destroy();

    this.audioManager?.destroy();

    this.app?.destroy(true);

    this.app = null;

    this.keyboard = null;

    this.collisionSystem = null;

    this.audioManager = null;

    this.objectControllers.clear();

    this.removeInteractionHandler = null;

    this.removeInventoryHandler = null;

    this.removeEscapeHandler = null;

    this.removeQuickSaveHandler = null;

    this.removeContainerTakeItemHandler = null;

    this.removeContainerTakeAllHandler = null;

    gamePauseController.clear();
  }
}
