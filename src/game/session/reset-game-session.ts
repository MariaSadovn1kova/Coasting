import { useContainerStore } from "../store/use-container-store";
import { useDialogueStore } from "../store/use-dialogue-store";
import { useGameUiStore } from "../store/use-game-ui-store";
import { useInventoryStore } from "../store/use-inventory-store";
import { useNpcStateStore } from "../store/use-npc-state-store";
import { usePendingLoadStore } from "../store/use-pending-load-store";
import { useSaveMenuStore } from "../store/use-save-menu-store";
import { useWorldStateStore } from "../store/use-world-state-store";
import { useGameFactsStore } from "../store/use-game-facts-store";

import { gamePauseController } from "../core/game-pause-controller";

export function resetGameSession() {
  useDialogueStore.getState().closeDialogue();

  useWorldStateStore.getState().resetWorld();

  useNpcStateStore.getState().resetNpcStates();

  useInventoryStore.getState().clearItems();

  usePendingLoadStore.getState().clearPendingLoad();

  useGameUiStore.getState().closeInventory();

  useContainerStore.getState().closeContainer();

  useSaveMenuStore.getState().closeSaveMenu();

  useGameFactsStore.getState().clearFacts();

  gamePauseController.clear();
}
