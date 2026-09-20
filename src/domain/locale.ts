// Languages supported by the site. English is the default (visitors whose
// browser is neither French nor English get English).
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// Address of a page in a given language: every language carries its own
// prefix, "/en/blender" and "/fr/blender". The bare "/" redirects to the
// default language.
export function localeHref(locale: Locale, path = ""): string {
  const suffix = path.startsWith("/") || path === "" ? path : `/${path}`;
  return `/${locale}${suffix}`;
}
