import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useAppStore } from "../../app/store/use-app-store";

import { LanguageSwitcher } from "../components/language-switcher";

import { MainMenuLoadMenu } from "./main-menu-load-menu";

import { SaveManager } from "../../game/save/save-manager";
import { usePendingLoadStore } from "../../game/store/use-pending-load-store";

import { resetGameSession } from "../../game/session/reset-game-session";

import "./main-menu.css";

const saveManager = new SaveManager();

export function MainMenu() {
  const { t } = useTranslation();

  const [isLoadMenuOpen, setIsLoadMenuOpen] = useState(false);
  const [isContinueAvailable, setIsContinueAvailable] = useState(false);

  const setPendingLoad = usePendingLoadStore((state) => state.setPendingLoad);

  const setScreen = useAppStore((state) => state.setScreen);

  const handleNewGame = () => {
    resetGameSession();

    setScreen("game");
  };

  const handleContinue = async () => {
    try {
      const slot = await saveManager.getLatestSaveSlot();

      if (slot === null) {
        return;
      }

      setPendingLoad(slot);

      setScreen("game");
    } catch (error) {
      console.error("Failed to continue game", error);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const checkSaves = async () => {
      try {
        const slot = await saveManager.getLatestSaveSlot();

        if (isCancelled) {
          return;
        }

        setIsContinueAvailable(slot !== null);
      } catch (error) {
        console.error("Failed to check saves", error);

        if (!isCancelled) {
          setIsContinueAvailable(false);
        }
      }
    };

    checkSaves();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <main className="main-menu">
      <div className="main-menu__language">
        <LanguageSwitcher />
      </div>

      <div className="main-menu__content">
        <h1 className="main-menu__title">{t("mainMenu.title")}</h1>

        <div className="main-menu__actions">
          <button
            type="button"
            className="main-menu__button"
            onClick={handleNewGame}
          >
            {t("mainMenu.newGame")}
          </button>

          <button
            type="button"
            className="main-menu__button"
            disabled={!isContinueAvailable}
            onClick={handleContinue}
          >
            {t("mainMenu.continueGame")}
          </button>

          <button
            type="button"
            className="main-menu__button"
            disabled={!isContinueAvailable}
            onClick={() => setIsLoadMenuOpen(true)}
          >
            {t("mainMenu.loadGame")}
          </button>

          <button type="button" className="main-menu__button" disabled>
            {t("mainMenu.settings")}
          </button>

          <button type="button" className="main-menu__button" disabled>
            {t("mainMenu.exit")}
          </button>
        </div>
      </div>

      <MainMenuLoadMenu
        isOpen={isLoadMenuOpen}
        onClose={() => setIsLoadMenuOpen(false)}
      />
    </main>
  );
}
