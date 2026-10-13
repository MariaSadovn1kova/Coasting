import { Application, Container } from "pixi.js";

import { GAME_CONFIG } from "./game-config";
import { gamePauseController } from "./game-pause-controller";

import { AudioManager } from "../audio/audio-manager";

import type { ILocation } from "../world/location";
import type { IGridPosition } from "../world/grid-position";
import type { IInteractiveWorldObject } from "../world/world-object";

import { createIsometricGrid } from "../world/create-isometric-grid";
import { createWorldObjectView } from "../world/create-world-object-view";
import { WorldObjectController } from "../world/world-object-controller";
import { createWallsLayer } from "../world/create-walls-layer";

import { getIsoDepth } from "../world/depth";
import { worldToIso } from "../world/iso";

import { createPlayer } from "../entities/create-player";
import { PlayerController } from "../entities/player-controller";

import type { TPlayerDirection } from "../entities/player-direction";

import { KeyboardController } from "../input/keyboard-controller";

import { InteractionSystem } from "../interaction/interaction-system";

import { CollisionSystem } from "../systems/collision-system";
import { PathfindingSystem } from "../systems/pathfinding-system";

import { InventoryController } from "../inventory/inventory-controller";

import { gameEventBus } from "../events/game-event-bus";

import { useWorldStateStore } from "../store/use-world-state-store";
import { useDialogueStore } from "../store/use-dialogue-store";
import { useNpcStateStore } from "../store/use-npc-state-store";
import { useInteractionHintStore } from "../store/use-interaction-hint-store";

import { SaveManager } from "../save/save-manager";

import type { ISaveData } from "../save/save-data";
import type { TSaveSlot } from "../save/save-slot";

import { getDialogueById } from "../../content/dialogues/dialogue-registry";
import { getNpcById } from "../../content/npcs/npc-registry";

import { DialogueController } from "../dialogue/dialogue-controller";

import { NpcDialogueResolver } from "../npc/npc-dialogue-resolver";

import { CameraController } from "../camera/camera-controller";
import { createLocationCameraBounds } from "../camera/create-location-camera-bounds";

import { GameConditionEvaluator } from "../conditions/game-condition-evaluator";
import { createGameConditionContext } from "../conditions/create-game-condition-context";

import { GameEffectApplier } from "../effects/game-effect-applier";
import { createGameEffectContext } from "../effects/create-game-effect-context";

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

  private location: ILocation | null = null;

  private saveManager = new SaveManager();

  private app: Application | null = null;

  private readonly worldContainer = new Container();

  private keyboard: KeyboardController | null = null;

  private collisionSystem: CollisionSystem | null = null;

  private audioManager: AudioManager | null = null;

  private objectControllers = new Map<string, WorldObjectController>();

  private objectViews = new Map<string, Container>();

  private onLoadGame: IGameEngineMountOptions["onLoadGame"] | null = null;

  private clickPath: IGridPosition[] = [];

  private clickTargetObjectId: string | null = null;

  private clickTargetInteraction: (() => void) | null = null;

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

    app.stage.eventMode = "static";

    app.stage.hitArea = app.screen;

    app.stage.cursor =
      'url("/assets/ui/cursor/cursor-default.svg") 4 4, default';

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

    const conditionContext = createGameConditionContext(inventory);

    const conditionEvaluator = new GameConditionEvaluator();

    const visibleObjects = location.objects.filter((object) => {
      const conditions = location.objectVisibility?.[object.id];

      if (
        conditions &&
        !conditionEvaluator.check(conditions, conditionContext)
      ) {
        return false;
      }

      const runtimeState = worldState.getObjectState(location.id, object.id);

      if (
        object.type === "interactive" &&
        object.interactionAction === "pickup" &&
        runtimeState?.isCollected
      ) {
        return false;
      }

      return true;
    });

    const runtimeLocation: ILocation = {
      ...location,

      objects: visibleObjects,
    };

    visibleObjects.forEach((object) => {
      const runtimeState = worldState.getObjectState(location.id, object.id);

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

    const collisionSystem = new CollisionSystem(runtimeLocation);

    const interactionSystem = new InteractionSystem(runtimeLocation);

    const pathfindingSystem = new PathfindingSystem(
      runtimeLocation,
      collisionSystem,
    );

    const audioManager = new AudioManager();

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

    const interactWithObject = (object: IInteractiveWorldObject) => {
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
            conditionContext,
          );

          const dialogue = getDialogueById(dialogueId);

          if (!dialogue) {
            console.warn(`Dialogue not found: ${dialogueId}`);

            return;
          }

          const dialogueController = new DialogueController({
            dialogue,

            effectContext: createGameEffectContext(inventory),

            conditionContext,
          });

          useDialogueStore
            .getState()
            .openDialogue(npc.id, dialogue.id, dialogueController);

          focusCameraOnObject(object.position.x, object.position.y);

          break;
        }

        case "transition": {
          this.cancelClickMovement();

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

        case "inspect": {
          break;
        }
      }
    };

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

      interactWithObject(object);
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

        return;
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

    visibleObjects.forEach((object) => {
      if (object.type !== "interactive") {
        return;
      }

      const objectView = this.objectViews.get(object.id);

      if (!objectView) {
        return;
      }

      objectView.eventMode = "static";

      objectView.cursor =
        'url("/assets/ui/cursor/cursor-interact.svg") 8 8, pointer';

      objectView.on("pointertap", () => {
        if (gamePauseController.isPaused()) {
          return;
        }

        this.moveToObject(player, object, pathfindingSystem, () => {
          interactWithObject(object);
        });
      });
    });

    keyboard.mount();

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

    this.location = runtimeLocation;

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

      const interactionHintStore = useInteractionHintStore.getState();

      if (
        interactiveObject &&
        this.objectControllers.has(interactiveObject.id) &&
        !gamePauseController.isPaused()
      ) {
        switch (interactiveObject.interactionAction) {
          case "talk":
            interactionHintStore.show("talk");

            break;

          case "open-container":
            interactionHintStore.show("open");

            break;

          case "transition":
            interactionHintStore.show("enter");

            break;

          case "pickup":
            interactionHintStore.show("pickup");

            break;

          case "inspect":
            interactionHintStore.show("inspect");

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
          interactionCameraPosition = {
            x: playerView.x,

            y: playerView.y,
          };
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

    this.cancelClickMovement();

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

    if (direction) {
      this.cancelClickMovement();

      player.setDirection(direction.direction);

      const position = player.getPosition();

      this.movePlayer(
        player,

        position.x + direction.x,

        position.y + direction.y,
      );

      return;
    }

    this.updateClickMovement(player);
  }

  private updateClickMovement(player: PlayerController) {
    if (this.clickPath.length === 0) {
      if (this.clickTargetObjectId) {
        this.completeClickMovement(player);
      }

      return;
    }

    const nextPosition = this.clickPath.shift();

    if (!nextPosition) {
      return;
    }

    const currentPosition = player.getPosition();

    const direction = this.getDirectionBetween(currentPosition, nextPosition);

    if (direction) {
      player.setDirection(direction);
    }

    const didMove = this.movePlayer(player, nextPosition.x, nextPosition.y);

    if (!didMove) {
      this.cancelClickMovement();
    }
  }

  private completeClickMovement(player: PlayerController) {
    const objectId = this.clickTargetObjectId;

    const interaction = this.clickTargetInteraction;

    this.clickPath = [];

    this.clickTargetObjectId = null;

    this.clickTargetInteraction = null;

    if (!objectId) {
      return;
    }

    const object = this.location?.objects.find(
      (currentObject) => currentObject.id === objectId,
    );

    if (!object || object.type !== "interactive") {
      return;
    }

    if (!this.objectControllers.has(object.id)) {
      return;
    }

    this.faceObject(player, object);

    if (gamePauseController.isPaused()) {
      return;
    }

    interaction?.();
  }

  private moveToObject(
    player: PlayerController,
    object: IInteractiveWorldObject,
    pathfindingSystem: PathfindingSystem,
    onArrive: () => void,
  ) {
    const path = pathfindingSystem.findPathToTarget(
      player.getPosition(),
      object.position,
    );

    if (!path) {
      console.warn(`Path not found to object: ${object.id}`);

      this.cancelClickMovement();

      return;
    }

    this.clickPath = path;

    this.clickTargetObjectId = object.id;

    this.clickTargetInteraction = onArrive;

    if (path.length === 0) {
      this.completeClickMovement(player);
    }
  }

  private cancelClickMovement() {
    this.clickPath = [];

    this.clickTargetObjectId = null;

    this.clickTargetInteraction = null;
  }

  private faceObject(
    player: PlayerController,
    object: IInteractiveWorldObject,
  ) {
    const position = player.getPosition();

    const relativeX = object.position.x - position.x;

    const relativeY = object.position.y - position.y;

    const directions: Array<{
      direction: TPlayerDirection;
      x: number;
      y: number;
    }> = [
      {
        direction: "up",
        x: -1,
        y: -1,
      },

      {
        direction: "down",
        x: 1,
        y: 1,
      },

      {
        direction: "left",
        x: -1,
        y: 1,
      },

      {
        direction: "right",
        x: 1,
        y: -1,
      },
    ];

    let bestDirection = directions[0];

    let bestScore = Number.NEGATIVE_INFINITY;

    directions.forEach((direction) => {
      const score = relativeX * direction.x + relativeY * direction.y;

      if (score > bestScore) {
        bestScore = score;

        bestDirection = direction;
      }
    });

    player.setDirection(bestDirection.direction);
  }

  private getDirectionBetween(
    from: IGridPosition,
    to: IGridPosition,
  ): TPlayerDirection | null {
    const x = to.x - from.x;

    const y = to.y - from.y;

    if (x < 0 && y < 0) {
      return "up";
    }

    if (x > 0 && y > 0) {
      return "down";
    }

    if (x < 0 && y > 0) {
      return "left";
    }

    if (x > 0 && y < 0) {
      return "right";
    }

    return null;
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

  private movePlayer(player: PlayerController, x: number, y: number): boolean {
    if (gamePauseController.isPaused()) {
      return false;
    }

    const position = player.getPosition();

    if (!this.collisionSystem?.canMove(position.x, position.y, x, y)) {
      return false;
    }

    player.moveTo(x, y);

    return true;
  }

  destroy() {
    this.cancelClickMovement();

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

    this.location = null;

    this.keyboard = null;

    this.collisionSystem = null;

    this.audioManager = null;

    this.onLoadGame = null;

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
