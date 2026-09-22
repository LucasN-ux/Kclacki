"use client";

import { KeyCombos } from "@/components/ui/Keycap";
import type { Locale } from "@/domain/locale";
import type { ShowcaseRow } from "@/domain/showcase";
import { usePlatform } from "@/hooks/usePlatform";
import { getDictionary } from "@/i18n";
import styles from "./PlatformShowcase.module.css";

// Real shortcuts, shown with the keys of the platform chosen in the header.
// Switching the toggle rewrites the keys in place: the page shows the
// difference instead of describing it.
export function PlatformShowcase({
  rows,
  locale,
}: {
  rows: ShowcaseRow[];
  locale: Locale;
}) {
  const { platform } = usePlatform();
  const { platforms } = getDictionary(locale);

  return (
    <ul className={styles.list}>
      {rows.map((row) => (
        <li key={`${row.softwareId}-${row.shortcutId}`} className={styles.row}>
          <span>
            <span className={styles.action}>{row.action[locale]}</span>
            <br />
            <span className={styles.context}>
              {row.softwareName} {row.version}
            </span>
          </span>
          <KeyCombos keys={row.keys} platform={platform} locale={locale} />
          <span className={row.same ? styles.same : styles.diff}>
            {row.same ? platforms.tagSame : platforms.tagDiff}
          </span>
        </li>
      ))}
    </ul>
  );
}
