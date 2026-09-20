import type { Locale } from "@/domain/locale";
import en from "./en.json";
import fr from "./fr.json";

// Both files must describe the same keys: the type comes from the English one,
// so a missing French key is a TypeScript error, not a missing word on the site.
export type Dictionary = typeof en;

const DICTIONARIES: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
