"use client";

import type { Locale } from "@/domain/locale";
import { favoriteKey, useFavorites } from "@/hooks/useFavorites";
import { getDictionary } from "@/i18n";
import styles from "./FavoriteStar.module.css";

export function FavoriteStar({
  softwareId,
  shortcutId,
  action,
  locale,
}: {
  softwareId: string;
  shortcutId: string;
  /** Name of the action, so the button says what it acts on. */
  action: string;
  locale: Locale;
}) {
  const { has, toggle } = useFavorites();
  const { favorites } = getDictionary(locale);
  const key = favoriteKey(softwareId, shortcutId);
  const kept = has(key);

  return (
    <button
      type="button"
      className={styles.star}
      aria-pressed={kept}
      aria-label={`${kept ? favorites.remove : favorites.add} : ${action}`}
      onClick={() => toggle(key)}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 8 60.6 37.4 91.8 38.4 67.1 57.6 75.9 87.6 50 70 24.1 87.6 32.9 57.6 8.2 38.4 39.4 37.4Z" />
      </svg>
    </button>
  );
}
