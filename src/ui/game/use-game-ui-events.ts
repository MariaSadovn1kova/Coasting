import { useEffect } from "react";

import { gameEventBus } from "../../game/events/game-event-bus";
import { useGameUiStore } from "../../game/store/use-game-ui-store";
import { useInventoryStore } from "../../game/store/use-inventory-store";

export function useGameUiEvents() {
  const toggleInventory = useGameUiStore((state) => state.toggleInventory);

  const setItems = useInventoryStore((state) => state.setItems);

  useEffect(() => {
    const removeInventoryToggleListener = gameEventBus.on(
      "inventory-toggle",
      () => {
        toggleInventory();
      },
    );

    const removeInventoryUpdatedListener = gameEventBus.on(
      "inventory-updated",
      (items) => {
        setItems(items);
      },
    );

    return () => {
      removeInventoryToggleListener();
      removeInventoryUpdatedListener();
    };
  }, [toggleInventory, setItems]);
}
