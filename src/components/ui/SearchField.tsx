"use client";

import type { RefObject } from "react";
import type { Locale } from "@/domain/locale";
import { getDictionary } from "@/i18n";
import styles from "./SearchField.module.css";

// The search field itself: it only draws, it never decides what to do with
// the text. The header submits it, the search page filters as you type.
export function SearchField({
  locale,
  value,
  onChange,
  onSubmit,
  inputRef,
  hero = false,
  showHint = false,
}: {
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  inputRef?: RefObject<HTMLInputElement | null>;
  /** The big field of the home page. */
  hero?: boolean;
  /** The "/" badge, shown where the keyboard shortcut is useful. */
  showHint?: boolean;
}) {
  const { search } = getDictionary(locale);

  return (
    <form
      role="search"
      className={`${styles.bar} ${hero ? styles.hero : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10" cy="10" r="7" />
        <path d="M15.2 15.2 21 21" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={search.placeholder}
        aria-label={search.label}
      />
      {showHint && (
        <span className={styles.hint} aria-hidden="true">
          /
        </span>
      )}
    </form>
  );
}
