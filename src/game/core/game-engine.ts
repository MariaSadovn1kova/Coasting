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

import { CameraController } from "../camera/camera-controller";
import { createLocationCameraBounds } from "../camera/create-location-camera-bounds";

import { createWallsLayer } from "../world/create-walls-layer";

import { useInteractionHintStore } from "../store/use-interaction-hint-store";

import { worldToIso } from "../world/iso";

import { GameEffectApplier } from "../effects/game-effect-applier";
import { createGameEffectContext } from "../effects/create-game-effect-context";

import { GameConditionEvaluator } from "../conditions/game-condition-evaluator";
import { createGameConditionContext } from "../conditions/create-game-condition-context";

type TInventoryItems = ReturnType<InventoryController["getItems"]>;

interface IGameEngineMountOptions {
  spawn?: {
    x: number;
    y: number;
  };

  inventory?: TInventoryItems;

  onTransition?: (
    locationId: string,
    position: {
      x: number;
      y: number;
    },
    inventory: TInventoryItems,
  ) => void;

  onLoadGame?: (
    locationId: string,
    position: {
      x: number;
      y: number;
    },
    inventory: TInventoryItems,
  ) => void;
}

export class GameEngine {
  private player: PlayerController | null = null;

  private inventory: InventoryController | null = null;

  private locationId: string | null = null;

  private saveManager = new SaveManager();

  private app: Application | null = null;

  private readonly worldContainer = new Container();

  private keyboard: KeyboardController | null = null;

  private collisionSystem: CollisionSystem | null = null;

  private audioManager: AudioManager | null = null;

  private objectControllers = new Map<string, WorldObjectController>();

  private objectViews = new Map<string, Container>();

  private onLoadGame: IGameEngineMountOptions["onLoadGame"] | null = null;

  private removeInteractionHandler: (() => void) | null = null;

  private removeInventoryHandler: (() => void) | null = null;

  private removeEscapeHandler: (() => void) | null = null;

  private removeContainerTakeItemHandler: (() => void) | null = null;

  private removeContainerTakeAllHandler: (() => void) | null = null;

  private removeQuickSaveHandler: (() => void) | null = null;

  async mount(
    element: HTMLElement,
    location: ILocation,
    options: IGameEngineMountOptions = {},
  ) {
    const app = new Application();

    await app.init({
      resizeTo: element,
      background: "#111318",
      antialias: true,
    });

    element.appendChild(app.canvas);

    this.worldContainer.sortableChildren = true;

    const grid = await createIsometricGrid(location);

    const walls = createWallsLayer(location);

    const entities = new Container();

    entities.sortableChildren = true;

    const worldState = useWorldStateStore.getState();

    const inventory = new InventoryController();

    if (options.inventory) {
      inventory.setItems(options.inventory);
    }

    const conditionEvaluator = new GameConditionEvaluator();

    const conditionContext = createGameConditionContext(inventory);

    const visibleObjects = location.objects.filter((object) => {
      const conditions = location.objectVisibility?.[object.id];

      return conditionEvaluator.check(conditions, conditionContext);
    });

    visibleObjects.forEach((object) => {
      const runtimeState = worldState.getObjectState(location.id, object.id);

      if (
        object.type === "interactive" &&
        object.interactionAction === "pickup" &&
        runtimeState?.isCollected
      ) {
        return;
      }

      const view = createWorldObjectView(object);

      const controller = new WorldObjectController({
        object,
        view,
        runtimeState,
      });

      this.objectControllers.set(object.id, controller);

      this.objectViews.set(object.id, view.container);

      entities.addChild(view.container);
    });

    const spawn = options.spawn ?? location.spawn;

    const playerView = createPlayer({
      x: spawn.x,
      y: spawn.y,
    });

    playerView.zIndex = getIsoDepth(spawn.x, spawn.y);

    const player = new PlayerController({
      view: playerView,

      position: {
        x: spawn.x,
        y: spawn.y,
      },
    });

    entities.addChild(playerView);

    const keyboard = new KeyboardController();

    const collisionSystem = new CollisionSystem(location);

    const interactionSystem = new InteractionSystem(location);

    const audioManager = new AudioManager();

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

          focusCameraOnObject(object.position.x, object.position.y);

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

          const dialogueId = dialogueResolver.resolve(
            npc,
            npcState,
            createGameConditionContext(inventory),
          );

          const dialogue = getDialogueById(dialogueId);

          if (!dialogue) {
            console.warn(`Dialogue not found: ${dialogueId}`);

            return;
          }

          const dialogueController = new DialogueController({
            dialogue,

            effectContext: createGameEffectContext(inventory),
          });

          useDialogueStore
            .getState()
            .openDialogue(npc.id, dialogue.id, dialogueController);

          focusCameraOnObject(object.position.x, object.position.y);

          break;
        }

        case "transition": {
          options.onTransition?.(
            object.targetLocationId,
            object.targetPosition,
            inventory.getItems(),
          );

          break;
        }

        case "pickup": {
          inventory.addItems([
            {
              item: object.item,
              quantity: object.quantity ?? 1,
            },
          ]);

          const effectApplier = new GameEffectApplier();

          effectApplier.apply(
            object.effects,
            createGameEffectContext(inventory),
          );

          worldState.patchObjectState(location.id, object.id, {
            isCollected: true,
          });

          const objectView = this.objectViews.get(object.id);

          if (objectView) {
            objectView.removeFromParent();
          }

          this.objectViews.delete(object.id);

          this.objectControllers.delete(object.id);

          gameEventBus.emit("inventory-updated", inventory.getItems());

          break;
        }

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

    this.worldContainer.addChild(grid);

    this.worldContainer.addChild(walls);

    this.worldContainer.addChild(entities);

    const cameraBounds = createLocationCameraBounds(location);

    const camera = new CameraController({
      world: this.worldContainer,

      viewportWidth: app.screen.width,

      viewportHeight: app.screen.height,

      zoom: GAME_CONFIG.camera.zoom,

      deadZoneWidth: app.screen.width * GAME_CONFIG.camera.deadZone.width,

      deadZoneHeight: app.screen.height * GAME_CONFIG.camera.deadZone.height,

      bounds: cameraBounds,
    });

    let interactionCameraTarget: {
      x: number;
      y: number;
    } | null = null;

    let interactionCameraPosition: {
      x: number;
      y: number;
    } | null = null;

    const INTERACTION_CAMERA_SPEED = 6;

    const focusCameraOnObject = (x: number, y: number) => {
      const position = worldToIso(x, y);

      interactionCameraTarget = {
        x: position.x,
        y: position.y,
      };

      interactionCameraPosition = camera.getFocusPoint();
    };

    camera.focusOn(playerView.x, playerView.y);

    app.stage.addChild(this.worldContainer);

    this.onLoadGame = options.onLoadGame ?? null;

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
      const interactiveObject = interactionSystem.getInteractiveObjectInFront(
        player.getPosition(),
        player.getDirection(),
      );

      const activeInteractiveObject =
        interactiveObject && this.objectControllers.has(interactiveObject.id)
          ? interactiveObject
          : null;

      const interactionHintStore = useInteractionHintStore.getState();

      if (activeInteractiveObject && !gamePauseController.isPaused()) {
        switch (activeInteractiveObject.interactionAction) {
          case "talk":
            interactionHintStore.show("talk");

            break;

          case "open-container":
            interactionHintStore.show("open");

            break;

          case "transition":
            interactionHintStore.show("enter");

            break;

          case "inspect":
            interactionHintStore.show("inspect");

            break;

          case "pickup":
            interactionHintStore.show("pickup");

            break;
        }
      } else {
        interactionHintStore.hide();
      }

      const hasCameraInteraction =
        gamePauseController.has("dialogue") ||
        gamePauseController.has("container");

      if (interactionCameraTarget && hasCameraInteraction) {
        if (!interactionCameraPosition) {
          interactionCameraPosition = camera.getFocusPoint();
        }

        const deltaSeconds = ticker.deltaMS / 1000;

        const smoothing =
          1 - Math.exp(-INTERACTION_CAMERA_SPEED * deltaSeconds);

        interactionCameraPosition.x +=
          (interactionCameraTarget.x - interactionCameraPosition.x) * smoothing;

        interactionCameraPosition.y +=
          (interactionCameraTarget.y - interactionCameraPosition.y) * smoothing;

        camera.focusOn(
          interactionCameraPosition.x,
          interactionCameraPosition.y,
        );
      } else {
        interactionCameraTarget = null;

        interactionCameraPosition = null;

        camera.update(playerView.x, playerView.y);
      }

      if (gamePauseController.isPaused()) {
        return;
      }

      const isRunning =
        keyboard.isPressed("ShiftLeft") || keyboard.isPressed("ShiftRight");

      const moveSpeed =
        GAME_CONFIG.player.moveSpeed *
        (isRunning ? GAME_CONFIG.player.runMultiplier : 1);

      player.update(ticker.deltaMS, moveSpeed);

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
    const loadedGame = await this.saveManager.loadGame(slot);

    this.onLoadGame?.(
      loadedGame.locationId,
      loadedGame.playerPosition,
      loadedGame.inventory,
    );

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
    const step = GAME_CONFIG.player.movementStep;

    if (keyboard.isPressed("KeyW") || keyboard.isPressed("ArrowUp")) {
      return {
        x: -step,
        y: -step,
        direction: "up",
      };
    }

    if (keyboard.isPressed("KeyS") || keyboard.isPressed("ArrowDown")) {
      return {
        x: step,
        y: step,
        direction: "down",
      };
    }

    if (keyboard.isPressed("KeyA") || keyboard.isPressed("ArrowLeft")) {
      return {
        x: -step,
        y: step,
        direction: "left",
      };
    }

    if (keyboard.isPressed("KeyD") || keyboard.isPressed("ArrowRight")) {
      return {
        x: step,
        y: -step,
        direction: "right",
      };
    }

    return null;
  }

  private movePlayer(player: PlayerController, x: number, y: number) {
    if (gamePauseController.isPaused()) {
      return;
    }

    const position = player.getPosition();

    if (!this.collisionSystem?.canMove(position.x, position.y, x, y)) {
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

    this.player = null;

    this.inventory = null;

    this.locationId = null;

    this.keyboard = null;

    this.collisionSystem = null;

    this.audioManager = null;

    this.objectControllers.clear();

    this.objectViews.clear();

    this.removeInteractionHandler = null;

    this.removeInventoryHandler = null;

    this.removeEscapeHandler = null;

    this.removeQuickSaveHandler = null;

    this.removeContainerTakeItemHandler = null;

    this.removeContainerTakeAllHandler = null;

    useInteractionHintStore.getState().hide();

    gamePauseController.clear();
  }
}
