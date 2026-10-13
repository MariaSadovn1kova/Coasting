import type { InventoryController } from "../inventory/inventory-controller";

import { useGameFactsStore } from "../store/use-game-facts-store";
import { useNpcStateStore } from "../store/use-npc-state-store";

import type { IGameConditionContext } from "./game-condition-context";

export function createGameConditionContext(
  inventory: InventoryController,
): IGameConditionContext {
  return {
    getFact: (key) => {
      return useGameFactsStore.getState().getFact(key);
    },

    getItemQuantity: (itemId) => {
      return inventory
        .getItems()
        .filter((entry) => entry.item.id === itemId)
        .reduce((total, entry) => total + entry.quantity, 0);
    },

    getRelationship: (npcId) => {
      const npcState = useNpcStateStore.getState().getNpcState(npcId);

      return npcState?.relationship;
    },
  };
}
