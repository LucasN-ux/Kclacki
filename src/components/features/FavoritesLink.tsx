"use client";

import Link from "next/link";
import { localeHref, type Locale } from "@/domain/locale";
import { useFavorites } from "@/hooks/useFavorites";
import { getDictionary } from "@/i18n";
import styles from "./FavoritesLink.module.css";

// Header link with the number kept. The count only exists in the browser, so
// the server renders the link without it and the number appears once loaded.
export function FavoritesLink({ locale }: { locale: Locale }) {
  const { count } = useFavorites();
  const { favorites } = getDictionary(locale);

  return (
    <Link
      href={localeHref(locale, "/favorites")}
      className={styles.link}
      // On a phone the star stands alone: the name is kept for screen readers.
      aria-label={favorites.title}
    >
      <svg className={styles.star} viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 8 60.6 37.4 91.8 38.4 67.1 57.6 75.9 87.6 50 70 24.1 87.6 32.9 57.6 8.2 38.4 39.4 37.4Z" />
      </svg>
      <span className={styles.label}>{favorites.title}</span>
      {count > 0 && <span className={styles.count}>{count}</span>}
    </Link>
  );
}
