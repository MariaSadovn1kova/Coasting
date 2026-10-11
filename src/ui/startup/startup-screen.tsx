import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useStartupStore } from "../../game/store/use-startup-store";

import "./startup-screen.css";

export function StartupScreen() {
  const { t } = useTranslation();

  const stage = useStartupStore((state) => state.stage);

  const showStudio = useStartupStore((state) => state.showStudio);

  const showDisclaimer = useStartupStore((state) => state.showDisclaimer);

  const complete = useStartupStore((state) => state.complete);

  useEffect(() => {
    let studioTimer: number | null = null;

    const runStartup = async () => {
      await document.fonts.ready;

      showStudio();

      studioTimer = window.setTimeout(() => {
        showDisclaimer();
      }, 1800);
    };

    runStartup();

    return () => {
      if (studioTimer !== null) {
        window.clearTimeout(studioTimer);
      }
    };
  }, [showStudio, showDisclaimer]);

  if (stage === "loading") {
    return <main className="startup-screen startup-screen--loading" />;
  }

  if (stage === "studio") {
    return (
      <main className="startup-screen">
        <div className="startup-screen__studio">
          <img
            className="startup-screen__logo"
            src="/assets/branding/studio-logo.jpg"
            alt={t("startup.studioAlt")}
          />

          <div className="startup-screen__studio-name">
            {t("startup.studioName")}
          </div>
        </div>
      </main>
    );
  }

  if (stage === "disclaimer") {
    return (
      <main className="startup-screen">
        <section className="startup-screen__disclaimer">
          <h1 className="startup-screen__title">
            {t("startup.disclaimer.title")}
          </h1>

          <div className="startup-screen__content">
            <p>{t("startup.disclaimer.paragraph1")}</p>

            <p>{t("startup.disclaimer.paragraph2")}</p>

            <p>{t("startup.disclaimer.paragraph3")}</p>

            <p>{t("startup.disclaimer.paragraph4")}</p>
          </div>

          <button
            type="button"
            className="startup-screen__button"
            onClick={complete}
          >
            {t("startup.disclaimer.continue")}
          </button>
        </section>
      </main>
    );
  }

  return null;
}
