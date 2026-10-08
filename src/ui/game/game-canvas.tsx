import { useEffect, useRef } from "react";

import { GameEngine } from "../../game/core/game-engine";

import { useGameEngineStore } from "../../game/store/use-game-engine-store";
import { usePendingLoadStore } from "../../game/store/use-pending-load-store";

import type { ILocation } from "../../game/world/location";

interface IGameCanvasProps {
  location: ILocation;
}

export function GameCanvas({ location }: IGameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const engine = new GameEngine();

    let isCancelled = false;

    const mount = async () => {
      await engine.mount(element, location);

      if (isCancelled) {
        engine.destroy();

        return;
      }

      useGameEngineStore.getState().setEngine(engine);

      const pendingSlot = usePendingLoadStore.getState().slot;

      if (pendingSlot === null) {
        return;
      }

      try {
        const loaded = await engine.loadGame(pendingSlot);

        if (loaded && !isCancelled) {
          usePendingLoadStore.getState().clearPendingLoad();
        }
      } catch (error) {
        console.error("Failed to load pending save", error);
      }
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
  }, [location]);

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
