import { useEffect } from "react";

import { gameEventBus } from "../../game/events/game-event-bus";

import { useContainerStore } from "../../game/store/use-container-store";
import { useGameUiStore } from "../../game/store/use-game-ui-store";
import { useInventoryStore } from "../../game/store/use-inventory-store";

export function useGameUiEvents() {
  const toggleInventory = useGameUiStore((state) => state.toggleInventory);

  const closeInventory = useGameUiStore((state) => state.closeInventory);

  const setInventoryItems = useInventoryStore((state) => state.setItems);

  const openContainer = useContainerStore((state) => state.openContainer);

  const setContainerItems = useContainerStore((state) => state.setItems);

  const closeContainer = useContainerStore((state) => state.closeContainer);

  useEffect(() => {
    const removeInventoryToggleListener = gameEventBus.on(
      "inventory-toggle",
      () => {
        toggleInventory();
      },
    );

    const removeInventoryCloseListener = gameEventBus.on(
      "inventory-close",
      () => {
        closeInventory();
      },
    );

    const removeInventoryUpdatedListener = gameEventBus.on(
      "inventory-updated",
      (items) => {
        setInventoryItems(items);
      },
    );

    const removeContainerOpenedListener = gameEventBus.on(
      "container-opened",
      ({ containerId, items }) => {
        openContainer(containerId, items);
      },
    );

    const removeContainerUpdatedListener = gameEventBus.on(
      "container-updated",
      (items) => {
        setContainerItems(items);
      },
    );

    const removeContainerCloseListener = gameEventBus.on(
      "container-close",
      () => {
        closeContainer();
      },
    );

    return () => {
      removeInventoryToggleListener();
      removeInventoryCloseListener();
      removeInventoryUpdatedListener();

      removeContainerOpenedListener();
      removeContainerUpdatedListener();
      removeContainerCloseListener();
    };
  }, [
    toggleInventory,
    closeInventory,
    setInventoryItems,
    openContainer,
    setContainerItems,
    closeContainer,
  ]);
}
