import type { Locale } from "@/domain/locale";
import type { Software } from "@/domain/schema";
import { getDictionary } from "@/i18n";
import styles from "./SoftwareCard.module.css";

export function SoftwareCard({
  software,
  locale,
}: {
  software: Software;
  locale: Locale;
}) {
  const dictionary = getDictionary(locale);

  return (
    <article className={styles.card}>
      <span className={styles.badge} aria-hidden="true">
        {software.initials}
      </span>
      <span>
        <span className={styles.name}>{software.name}</span>
        <br />
        {/* Real count, read from the data file: never a number typed by hand. */}
        <span className={styles.count}>
          {software.shortcuts.length} {dictionary.site.shortcutCount}
        </span>
      </span>
    </article>
  );
}
