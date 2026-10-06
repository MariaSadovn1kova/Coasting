import { useTranslation } from "react-i18next";

import { useAppStore } from "../../app/store/use-app-store";

import { LanguageSwitcher } from "../components/language-switcher";

import "./main-menu.css";

export function MainMenu() {
  const { t } = useTranslation();

  const setScreen = useAppStore((state) => state.setScreen);

  const handleNewGame = () => {
    setScreen("game");
  };

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

          <button type="button" className="main-menu__button" disabled>
            {t("mainMenu.continueGame")}
          </button>

          <button type="button" className="main-menu__button" disabled>
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
    </main>
  );
}
