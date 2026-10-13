import { useEffect, useRef, useState } from "react";

import { GameEngine } from "../../game/core/game-engine";

import { useGameEngineStore } from "../../game/store/use-game-engine-store";
import { usePendingLoadStore } from "../../game/store/use-pending-load-store";

import type { ILocation } from "../../game/world/location";
import type { TContainerContent } from "../../game/inventory/container-content";

import { SaveManager } from "../../game/save/save-manager";

import { getLocationById } from "../../content/locations/location-registry";

interface IGameCanvasProps {
  location: ILocation;
}

interface IActiveLocation {
  id: string;

  spawn?: {
    x: number;
    y: number;
  };

  inventory?: TContainerContent;

  revision: number;
}

export function GameCanvas({ location }: IGameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeLocation, setActiveLocation] = useState<IActiveLocation>({
    id: location.id,
    revision: 0,
  });

  const [isReady, setIsReady] = useState(
    () => usePendingLoadStore.getState().slot === null,
  );

  const currentLocation =
    activeLocation.id === location.id
      ? location
      : getLocationById(activeLocation.id);

  useEffect(() => {
    const pendingSlot = usePendingLoadStore.getState().slot;

    if (pendingSlot === null) {
      setIsReady(true);

      return;
    }

    let isCancelled = false;

    const loadPendingSave = async () => {
      try {
        const saveManager = new SaveManager();

        const loadedGame = await saveManager.loadGame(pendingSlot);

        if (isCancelled) {
          return;
        }

        setActiveLocation({
          id: loadedGame.locationId,

          spawn: {
            x: loadedGame.playerPosition.x,

            y: loadedGame.playerPosition.y,
          },

          inventory: loadedGame.inventory,

          revision: 1,
        });

        usePendingLoadStore.getState().clearPendingLoad();

        setIsReady(true);
      } catch (error) {
        console.error("Failed to load pending save", error);

        if (isCancelled) {
          return;
        }

        usePendingLoadStore.getState().clearPendingLoad();

        setIsReady(true);
      }
    };

    loadPendingSave();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const element = containerRef.current;

    if (!element || !currentLocation) {
      return;
    }

    const engine = new GameEngine();

    let isCancelled = false;

    const mount = async () => {
      await engine.mount(element, currentLocation, {
        spawn: activeLocation.spawn,

        inventory: activeLocation.inventory,

        onTransition: (locationId, position, inventory) => {
          if (isCancelled) {
            return;
          }

          setActiveLocation((current) => ({
            id: locationId,

            spawn: {
              x: position.x,

              y: position.y,
            },

            inventory,

            revision: current.revision + 1,
          }));
        },

        onLoadGame: (locationId, position, inventory) => {
          if (isCancelled) {
            return;
          }

          setActiveLocation((current) => ({
            id: locationId,

            spawn: {
              x: position.x,

              y: position.y,
            },

            inventory,

            revision: current.revision + 1,
          }));
        },
      });

      if (isCancelled) {
        engine.destroy();

        return;
      }

      useGameEngineStore.getState().setEngine(engine);
    };

    mount();

    return () => {
      isCancelled = true;

      const currentEngine = useGameEngineStore.getState().engine;

      if (currentEngine === engine) {
        useGameEngineStore.getState().setEngine(null);
      }

      engine.destroy();
    };
  }, [
    isReady,
    currentLocation,
    activeLocation.spawn?.x,
    activeLocation.spawn?.y,
    activeLocation.revision,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
