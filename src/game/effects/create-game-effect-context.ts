import type { InventoryController } from "../inventory/inventory-controller";

import { gameEventBus } from "../events/game-event-bus";

import { useGameFactsStore } from "../store/use-game-facts-store";
import { useNpcStateStore } from "../store/use-npc-state-store";

import { getItemById } from "../../content/items/item-registry";

import type { IGameEffectContext } from "./game-effect-context";

export function createGameEffectContext(
  inventory: InventoryController,
): IGameEffectContext {
  return {
    setFact: (key, value) => {
      useGameFactsStore.getState().setFact(key, value);
    },

    changeRelationship: (npcId, amount) => {
      useNpcStateStore.getState().changeRelationship(npcId, amount);
    },

    addItem: (itemId, quantity) => {
      const item = getItemById(itemId);

      if (!item) {
        console.warn(`Item not found: ${itemId}`);

        return;
      }

      inventory.addItem({
        item,
        quantity,
      });

      gameEventBus.emit("inventory-updated", inventory.getItems());
    },

    removeItem: (itemId, quantity) => {
      inventory.removeItem(itemId, quantity);

      gameEventBus.emit("inventory-updated", inventory.getItems());
    },
  };
}
