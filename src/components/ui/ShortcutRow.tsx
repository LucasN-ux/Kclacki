import { FavoriteStar } from "@/components/features/FavoriteStar";
import { isSameOnBothPlatforms } from "@/domain/keys";
import type { Locale } from "@/domain/locale";
import type { FlaggedRows } from "@/domain/platformDifference";
import { summarizePlatformDifference } from "@/domain/platformDifference";
import type { Platform, Shortcut } from "@/domain/schema";
import { KeyCombos } from "./Keycap";
import { getDictionary } from "@/i18n";
import styles from "./ShortcutRow.module.css";

// Windows and Mac are product names: they are not translated.
const OTHER_PLATFORM: Record<Platform, string> = { win: "Mac", mac: "Windows" };

export function PlatformSummary({
  shortcuts,
  locale,
}: {
  shortcuts: Shortcut[];
  locale: Locale;
}) {
  const { total, differing } = summarizePlatformDifference(shortcuts);
  const { shortcut } = getDictionary(locale);
  const text =
    differing === 0
      ? shortcut.allSame
      : differing === total
        ? shortcut.allDifferent
        : `${differing} / ${total} ${shortcut.mixed}.`;

  return <p className={styles.summary}>{text}</p>;
}

export function ShortcutRow({
  shortcut,
  softwareId,
  platform,
  locale,
  flag,
}: {
  shortcut: Shortcut;
  softwareId: string;
  platform: Platform;
  locale: Locale;
  flag: FlaggedRows;
}) {
  const { shortcut: labels } = getDictionary(locale);
  const isSame = isSameOnBothPlatforms(shortcut.keys);
  const showFlag =
    (flag === "differing" && !isSame) || (flag === "same" && isSame)
      ? flag
      : null;

  return (
    <li className={styles.row}>
      <span>
        <span className={styles.action}>{shortcut.action[locale]}</span>
        {showFlag && (
          <span
            className={
              showFlag === "differing" ? styles.different : styles.identical
            }
          >
            {showFlag === "differing" ? labels.differsOn : labels.sameOn}{" "}
            {OTHER_PLATFORM[platform]}
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
      <FavoriteStar
        softwareId={softwareId}
        shortcutId={shortcut.id}
        action={shortcut.action[locale]}
        locale={locale}
      />
    </li>
  );
}

export function ShortcutList({
  shortcuts,
  softwareId,
  platform,
  locale,
  flag,
}: {
  shortcuts: Shortcut[];
  softwareId: string;
  platform: Platform;
  locale: Locale;
  /** Which rows carry a flag, decided once for the whole software. */
  flag: FlaggedRows;
}) {
  return (
    <ul className={styles.list}>
      {shortcuts.map((shortcut) => (
        <ShortcutRow
          key={shortcut.id}
          shortcut={shortcut}
          softwareId={softwareId}
          platform={platform}
          locale={locale}
          flag={flag}
        />
      ))}
    </ul>
  );
}
