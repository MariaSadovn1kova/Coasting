import { useEffect, useRef } from "react";

import { GameEngine } from "../../game/core/game-engine";

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
      }
    };

    mount();

    return () => {
      isCancelled = true;

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
