import { isSameOnBothPlatforms } from "@/domain/keys";
import type { Locale } from "@/domain/locale";
import type { Platform, Shortcut } from "@/domain/schema";
import { KeyCombos } from "./Keycap";
import styles from "./ShortcutRow.module.css";

// Only the exception is marked: saying nothing means "same keys on both
// platforms", which is the case for most shortcuts.
const DIFFERENT_LABEL: Record<Platform, Record<Locale, string>> = {
  win: { en: "Differs on Mac", fr: "Diffère sur Mac" },
  mac: { en: "Differs on Windows", fr: "Diffère sur Windows" },
};

export function ShortcutRow({
  shortcut,
  platform,
  locale,
}: {
  shortcut: Shortcut;
  platform: Platform;
  locale: Locale;
}) {
  return (
    <li className={styles.row}>
      <span>
        <span className={styles.action}>{shortcut.action[locale]}</span>
        {!isSameOnBothPlatforms(shortcut.keys) && (
          <span className={styles.different}>
            {DIFFERENT_LABEL[platform][locale]}
          </span>
        )}
        {shortcut.context && (
          <>
            <br />
            <span className={styles.context}>{shortcut.context[locale]}</span>
          </>
        )}
      </span>
      <KeyCombos keys={shortcut.keys} platform={platform} locale={locale} />
    </li>
  );
}

export function ShortcutList({
  shortcuts,
  platform,
  locale,
}: {
  shortcuts: Shortcut[];
  platform: Platform;
  locale: Locale;
}) {
  return (
    <ul className={styles.list}>
      {shortcuts.map((shortcut) => (
        <ShortcutRow
          key={shortcut.id}
          shortcut={shortcut}
          platform={platform}
          locale={locale}
        />
      ))}
    </ul>
  );
}
