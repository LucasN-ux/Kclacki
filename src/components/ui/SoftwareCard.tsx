import type { Locale } from "@/domain/locale";
import type { Software } from "@/domain/schema";
import styles from "./SoftwareCard.module.css";

const COUNT_LABEL: Record<Locale, (count: number) => string> = {
  en: (count) => `${count} shortcuts`,
  fr: (count) => `${count} raccourcis`,
};

export function SoftwareCard({
  software,
  locale,
}: {
  software: Software;
  locale: Locale;
}) {
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
          {COUNT_LABEL[locale](software.shortcuts.length)}
        </span>
      </span>
    </article>
  );
}
