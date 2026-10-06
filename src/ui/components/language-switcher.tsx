import { useSettingsStore } from "../../app/store/use-settings-store";

import type { TLanguage } from "../../i18n/languages";

import "./language-switcher.css";

const languageLabels: Record<TLanguage, string> = {
  ru: "RU",
  en: "EN",
};

export function LanguageSwitcher() {
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  return (
    <div className="language-switcher">
      {(Object.keys(languageLabels) as TLanguage[]).map((item) => (
        <button
          key={item}
          type="button"
          className="language-switcher__button"
          onClick={() => setLanguage(item)}
          disabled={language === item}
        >
          {languageLabels[item]}
        </button>
      ))}
    </div>
  );
}
