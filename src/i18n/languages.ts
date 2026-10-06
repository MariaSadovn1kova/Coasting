export const languages = ["ru", "en"] as const;

export type TLanguage = (typeof languages)[number];

export const defaultLanguage: TLanguage = "ru";
