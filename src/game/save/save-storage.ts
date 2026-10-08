import {
  BaseDirectory,
  exists,
  mkdir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";

import type { ISaveData } from "./save-data";

import { getSaveFileName, type TSaveSlot } from "./save-slot";

const SAVE_DIRECTORY = "saves";

export class SaveStorage {
  async save(slot: TSaveSlot, data: ISaveData) {
    await this.ensureSaveDirectory();

    const fileName = getSaveFileName(slot);

    await writeTextFile(
      `${SAVE_DIRECTORY}/${fileName}`,
      JSON.stringify(data, null, 2),
      {
        baseDir: BaseDirectory.AppLocalData,
      },
    );
  }

  async load(slot: TSaveSlot): Promise<ISaveData> {
    const fileName = getSaveFileName(slot);

    const content = await readTextFile(`${SAVE_DIRECTORY}/${fileName}`, {
      baseDir: BaseDirectory.AppLocalData,
    });

    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error(`Save slot ${slot} contains invalid JSON`);
    }

    if (!this.isSaveData(parsed)) {
      throw new Error(`Save slot ${slot} has invalid data`);
    }

    return parsed;
  }

  async exists(slot: TSaveSlot) {
    const fileName = getSaveFileName(slot);

    return exists(`${SAVE_DIRECTORY}/${fileName}`, {
      baseDir: BaseDirectory.AppLocalData,
    });
  }

  private isSaveData(value: unknown): value is ISaveData {
    if (typeof value !== "object" || value === null) {
      return false;
    }

    const save = value as Partial<ISaveData>;

    return (
      typeof save.version === "number" &&
      typeof save.createdAt === "string" &&
      typeof save.updatedAt === "string" &&
      typeof save.player === "object" &&
      save.player !== null &&
      typeof save.player.locationId === "string" &&
      typeof save.player.position === "object" &&
      save.player.position !== null &&
      Array.isArray(save.inventory) &&
      typeof save.world === "object" &&
      save.world !== null
    );
  }

  private async ensureSaveDirectory() {
    const directoryExists = await exists(SAVE_DIRECTORY, {
      baseDir: BaseDirectory.AppLocalData,
    });

    if (directoryExists) {
      return;
    }

    await mkdir(SAVE_DIRECTORY, {
      baseDir: BaseDirectory.AppLocalData,
      recursive: true,
    });
  }
}
