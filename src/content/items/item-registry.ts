import type { IItem } from "../../game/inventory/item";

import { oldKey } from "./old-key";
import { lunaBrokenPendantItem } from "./luna-broken-pendant";

const items: IItem[] = [oldKey, lunaBrokenPendantItem];

const itemMap = new Map(items.map((item) => [item.id, item]));

export function getItemById(itemId: string): IItem | undefined {
  return itemMap.get(itemId);
}
