import type { Locale } from "@/domain/locale";
import type { Software } from "@/domain/schema";

// The same action carries the same id in every file, so a page can name an
// action it does not itself document by borrowing the wording from a software
// that does. Nothing is invented: the label already exists in the catalogue.
export function actionLabel(
  list: Software[],
  action: string,
  locale: Locale,
): string | undefined {
  for (const software of list) {
    const match = software.shortcuts.find((shortcut) => shortcut.id === action);
    if (match) return match.action[locale];
  }
  return undefined;
}
