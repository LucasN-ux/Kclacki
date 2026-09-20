"use client";

import { usePlatform } from "@/hooks/usePlatform";
import type { Locale } from "@/domain/locale";
import type { Platform } from "@/domain/schema";
import styles from "./PlatformToggle.module.css";

const GROUP_LABEL: Record<Locale, string> = {
  en: "Shortcut platform",
  fr: "Plateforme des raccourcis",
};

const OPTIONS: { value: Platform; label: string }[] = [
  { value: "win", label: "Windows" },
  { value: "mac", label: "Mac" },
];

export function PlatformToggle({ locale }: { locale: Locale }) {
  const { platform, setPlatform } = usePlatform();

  return (
    <div
      className={styles.toggle}
      role="group"
      aria-label={GROUP_LABEL[locale]}
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
