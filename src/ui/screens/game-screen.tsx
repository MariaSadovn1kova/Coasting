import { useTranslation } from "react-i18next";

import { useAppStore } from "../../app/store/use-app-store";

import { testRoom } from "../../content/locations/test-room";

import { useSaveMenuStore } from "../../game/store/use-save-menu-store";

import { DialoguePanel } from "../game/dialogue/dialogue-panel";
import { GameCanvas } from "../game/game-canvas";
import { ContainerPanel } from "../game/inventory/container-panel";
import { InventoryPanel } from "../game/inventory/inventory-panel";
import { resetGameUi } from "../game/reset-game-ui";
import { SaveMenu } from "../game/save/save-menu";
import { useGameUiEvents } from "../game/use-game-ui-events";

export function GameScreen() {
  const { t } = useTranslation();

  const setScreen = useAppStore((state) => state.setScreen);

  const openSaveMenu = useSaveMenuStore((state) => state.openSaveMenu);

  const openLoadMenu = useSaveMenuStore((state) => state.openLoadMenu);

  useGameUiEvents();

  const handleBackToMenu = () => {
    resetGameUi();

    setScreen("main-menu");
  };

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

        <button type="button" onClick={openSaveMenu}>
          {t("saveMenu.saveTitle")}
        </button>

        <button type="button" onClick={openLoadMenu}>
          {t("saveMenu.loadTitle")}
        </button>

        <button type="button" onClick={handleBackToMenu}>
          {t("game.backToMenu")}
        </button>
      </div>

      <InventoryPanel />

      <ContainerPanel />

      <SaveMenu />

      <DialoguePanel />
    </main>
  );
}
