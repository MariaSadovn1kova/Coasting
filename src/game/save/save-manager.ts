import type { IContainerItem } from "../inventory/container-content";
import type { IGridPosition } from "../world/grid-position";

import { useWorldStateStore } from "../store/use-world-state-store";
import { useNpcStateStore } from "../store/use-npc-state-store";

import {
  inventoryFromSaveData,
  inventoryToSaveData,
} from "./inventory-save-mapper";

import type { ISaveData } from "./save-data";

import { SaveStorage } from "./save-storage";

import type { TSaveSlot } from "./save-slot";
import { saveSlots } from "./save-slot";

interface ICreateSaveDataParams {
  locationId: string;
  playerPosition: IGridPosition;
  inventory: IContainerItem[];
}

export interface ILoadedGameData {
  locationId: string;
  playerPosition: IGridPosition;
  inventory: IContainerItem[];
}

export class SaveManager {
  private storage = new SaveStorage();

  createSaveData({
    locationId,
    playerPosition,
    inventory,
  }: ICreateSaveDataParams): ISaveData {
    const now = new Date().toISOString();

    const world = useWorldStateStore.getState().world;
    const npcs = useNpcStateStore.getState().npcs;

    return {
      version: 1,

      createdAt: now,
      updatedAt: now,

      player: {
        locationId,

        position: {
          ...playerPosition,
        },
      },

      inventory: inventoryToSaveData(inventory),

      world: structuredClone(world),
      npcs: structuredClone(npcs),
    };
  }

  async getLatestSaveSlot(): Promise<TSaveSlot | null> {
    const slots = await this.getSlotsInfo();

    const existingSlots = slots.filter(
      (slot) => slot.exists && !slot.isCorrupted && slot.updatedAt,
    );

    if (existingSlots.length === 0) {
      return null;
    }

    existingSlots.sort(
      (a, b) =>
        new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime(),
    );

    return existingSlots[0].slot;
  }

  async getSlotsInfo() {
    return Promise.all(
      saveSlots.map(async (slot) => {
        const exists = await this.storage.exists(slot);

        if (!exists) {
          return {
            slot,
            exists: false,
            isCorrupted: false,
            updatedAt: null,
            locationId: null,
          };
        }

        try {
          const saveData = await this.storage.load(slot);

          return {
            slot,
            exists: true,
            isCorrupted: false,
            updatedAt: saveData.updatedAt,
            locationId: saveData.player.locationId,
          };
        } catch (error) {
          console.error(`Failed to read save slot ${slot}`, error);

          return {
            slot,
            exists: true,
            isCorrupted: true,
            updatedAt: null,
            locationId: null,
          };
        }
      }),
    );
  }

  async save(slot: TSaveSlot, params: ICreateSaveDataParams) {
    const saveData = this.createSaveData(params);

    await this.storage.save(slot, saveData);

    return saveData;
  }

  async load(slot: TSaveSlot) {
    return this.storage.load(slot);
  }

  async loadGame(slot: TSaveSlot): Promise<ILoadedGameData> {
    const saveData = await this.storage.load(slot);

    useWorldStateStore.getState().setWorld(saveData.world);
    useNpcStateStore.getState().setNpcStates(saveData.npcs ?? {});

    const inventory = inventoryFromSaveData(saveData.inventory);

    return {
      locationId: saveData.player.locationId,

      playerPosition: {
        ...saveData.player.position,
      },

      inventory,
    };
  }

  async hasSave(slot: TSaveSlot) {
    return this.storage.exists(slot);
  }
}
