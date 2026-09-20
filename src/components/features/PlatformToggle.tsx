"use client";

import { usePlatform } from "@/hooks/usePlatform";
import type { Locale } from "@/domain/locale";
import type { Platform } from "@/domain/schema";
import { getDictionary } from "@/i18n";
import styles from "./PlatformToggle.module.css";

const OPTIONS: { value: Platform; label: string }[] = [
  { value: "win", label: "Windows" },
  { value: "mac", label: "Mac" },
];

export function PlatformToggle({ locale }: { locale: Locale }) {
  const { platform, setPlatform } = usePlatform();
  const dictionary = getDictionary(locale);

  return (
    <div
      className={styles.toggle}
      role="group"
      aria-label={dictionary.platform.label}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.option}
          aria-pressed={platform === option.value}
          onClick={() => setPlatform(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
