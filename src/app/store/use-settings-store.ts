import { create } from "zustand";

import i18n from "../../i18n";

import { defaultLanguage, type TLanguage } from "../../i18n/languages";

interface ISettingsState {
  language: TLanguage;

  setLanguage: (language: TLanguage) => void;
}

export const useSettingsStore = create<ISettingsState>((set) => ({
  language: defaultLanguage,

  setLanguage: (language) => {
    i18n.changeLanguage(language);

    set({ language });
  },
}));
