import { useTranslation } from "react-i18next";

import { useAppStore } from "../../app/store/use-app-store";

import { testRoom } from "../../content/locations/test-room";

import { GameCanvas } from "../game/game-canvas";
import { InventoryPanel } from "../game/inventory/inventory-panel";
import { useGameUiEvents } from "../game/use-game-ui-events";

export function GameScreen() {
  const { t } = useTranslation();

  const setScreen = useAppStore((state) => state.setScreen);

  useGameUiEvents();

  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <GameCanvas location={testRoom} />

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,

          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",

          gap: 12,

          zIndex: 10,
        }}
      >
        <strong>{t(testRoom.nameKey)}</strong>

        <button type="button" onClick={() => setScreen("main-menu")}>
          {t("game.backToMenu")}
        </button>
      </div>

      <InventoryPanel />
    </main>
  );
}
