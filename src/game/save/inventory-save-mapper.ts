import { getItemById } from "../../content/items/item-registry";

import type { IContainerItem } from "../inventory/container-content";

import type { IInventorySaveItem } from "./save-data";

export function inventoryToSaveData(
  items: IContainerItem[],
): IInventorySaveItem[] {
  return items.map((entry) => ({
    itemId: entry.item.id,
    quantity: entry.quantity,
  }));
}

export function inventoryFromSaveData(
  items: IInventorySaveItem[],
): IContainerItem[] {
  return items.flatMap((entry) => {
    const item = getItemById(entry.itemId);

    if (!item) {
      console.warn(`Unknown item in save: ${entry.itemId}`);

      return [];
    }

    return [
      {
        item,
        quantity: entry.quantity,
      },
    ];
  });
}
