import { isSameOnBothPlatforms } from "@/domain/keys";
import type { Locale } from "@/domain/locale";
import type { Platform, Shortcut } from "@/domain/schema";
import { KeyCombos } from "./Keycap";
import styles from "./ShortcutRow.module.css";

const SAME_LABEL: Record<Locale, string> = {
  en: "Same on Windows & Mac",
  fr: "Identique Windows / Mac",
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
        {isSameOnBothPlatforms(shortcut.keys) && (
          <span className={styles.same}>{SAME_LABEL[locale]}</span>
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
