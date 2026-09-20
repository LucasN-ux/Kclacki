import { isSameOnBothPlatforms } from "@/domain/keys";
import type { Locale } from "@/domain/locale";
import type { FlaggedRows } from "@/domain/platformDifference";
import { summarizePlatformDifference } from "@/domain/platformDifference";
import type { Platform, Shortcut } from "@/domain/schema";
import { KeyCombos } from "./Keycap";
import styles from "./ShortcutRow.module.css";

const OTHER_PLATFORM: Record<Platform, Record<Locale, string>> = {
  win: { en: "Mac", fr: "Mac" },
  mac: { en: "Windows", fr: "Windows" },
};

const FLAG_LABEL: Record<"differing" | "same", Record<Locale, string>> = {
  differing: { en: "Differs on", fr: "Diffère sur" },
  same: { en: "Same on", fr: "Identique sur" },
};

// One sentence above the list, so the rare flags below stay meaningful.
const SUMMARY: Record<
  "all-same" | "all-different" | "mixed",
  Record<Locale, string>
> = {
  "all-same": {
    en: "Same keys on Windows and Mac.",
    fr: "Les mêmes touches sur Windows et Mac.",
  },
  "all-different": {
    en: "Every shortcut uses different keys on Mac.",
    fr: "Tous les raccourcis changent de touches sur Mac.",
  },
  mixed: { en: "shortcuts change on Mac", fr: "raccourcis changent sur Mac" },
};

export function ShortcutRow({
  shortcut,
  platform,
  locale,
  flag,
}: {
  shortcut: Shortcut;
  platform: Platform;
  locale: Locale;
  flag: FlaggedRows;
}) {
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
            {FLAG_LABEL[showFlag][locale]} {OTHER_PLATFORM[platform][locale]}
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
  const { total, differing, flag } = summarizePlatformDifference(shortcuts);
  const summary =
    differing === 0
      ? SUMMARY["all-same"][locale]
      : differing === total
        ? SUMMARY["all-different"][locale]
        : `${differing} / ${total} ${SUMMARY.mixed[locale]}.`;

  return (
    <>
      <p className={styles.summary}>{summary}</p>
      <ul className={styles.list}>
        {shortcuts.map((shortcut) => (
          <ShortcutRow
            key={shortcut.id}
            shortcut={shortcut}
            platform={platform}
            locale={locale}
            flag={flag}
          />
        ))}
      </ul>
    </>
  );
}
