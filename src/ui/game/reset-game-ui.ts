import { useContainerStore } from "../../game/store/use-container-store";
import { useGameUiStore } from "../../game/store/use-game-ui-store";
import { useSaveMenuStore } from "../../game/store/use-save-menu-store";

export function resetGameUi() {
  useGameUiStore.getState().closeInventory();

  useContainerStore.getState().closeContainer();

  useSaveMenuStore.getState().closeSaveMenu();
}
