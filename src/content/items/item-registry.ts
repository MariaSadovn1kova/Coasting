import type { IItem } from "../../game/inventory/item";

import { oldKey } from "./old-key";

const items: IItem[] = [oldKey];

const itemRegistry = new Map(items.map((item) => [item.id, item]));

export function getItemById(itemId: string): IItem | null {
  return itemRegistry.get(itemId) ?? null;
}
