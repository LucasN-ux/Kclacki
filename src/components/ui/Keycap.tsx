import { isModifier, isMouse, keyLabel } from "@/domain/keys";
import type { Locale } from "@/domain/locale";
import type { Keys, Platform } from "@/domain/schema";
import styles from "./Keycap.module.css";

type KeyProps = { keyName: string; platform: Platform; locale: Locale };

export function Keycap({ keyName, platform, locale }: KeyProps) {
  const className = [
    styles.key,
    isModifier(keyName) ? styles.modifier : "",
    isMouse(keyName) ? styles.mouse : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <kbd className={className}>{keyLabel(keyName, platform, locale)}</kbd>;
}

const OR_LABEL: Record<Locale, string> = { en: "or", fr: "ou" };

// Every way to trigger the action on this platform: keys joined by "+",
// alternatives separated by "or".
export function KeyCombos({
  keys,
  platform,
  locale,
}: {
  keys: Keys;
  platform: Platform;
  locale: Locale;
}) {
  return (
    <span className={styles.combo}>
      {keys[platform].map((combo, comboIndex) => (
        <span key={comboIndex} className={styles.combo}>
          {comboIndex > 0 && (
            <span className={styles.or}>{OR_LABEL[locale]}</span>
          )}
          {combo.map((keyName, keyIndex) => (
            <span key={keyIndex} className={styles.combo}>
              {keyIndex > 0 && <span className={styles.plus}>+</span>}
              <Keycap keyName={keyName} platform={platform} locale={locale} />
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
