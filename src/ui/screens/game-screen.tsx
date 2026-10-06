import { useTranslation } from "react-i18next";

import { useAppStore } from "../../app/store/use-app-store";
import { testRoom } from "../../content/locations/test-room";
import { GameCanvas } from "../game/game-canvas";

export function GameScreen() {
  const { t } = useTranslation();

  const setScreen = useAppStore((state) => state.setScreen);

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
        }}
      >
        <strong>{t(testRoom.nameKey)}</strong>

        <button type="button" onClick={() => setScreen("main-menu")}>
          {t("game.backToMenu")}
        </button>
      </div>
    </main>
  );
}
