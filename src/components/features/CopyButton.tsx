"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/domain/locale";
import { getDictionary } from "@/i18n";
import styles from "./CopyButton.module.css";

const CONFIRM_MS = 2000;

// Puts a ready-made line on the clipboard. The button keeps its size while it
// confirms, so the keys beside it never jump; the word "copied" is announced
// to screen readers through a status region.
export function CopyButton({
  text,
  action,
  locale,
}: {
  /** The exact line to copy, built by shortcutText. */
  text: string;
  /** Name of the action, so the button says what it copies. */
  action: string;
  locale: Locale;
}) {
  const { shortcut } = getDictionary(locale);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // No clipboard (old browser, denied permission): say nothing rather
      // than claim a copy that did not happen.
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), CONFIRM_MS);
  }

  return (
    <button
      type="button"
      className={styles.copy}
      data-copied={copied || undefined}
      aria-label={`${shortcut.copy} : ${action}`}
      onClick={copy}
    >
      {copied ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path className={styles.check} d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
          <path d="M15.5 5.5A2 2 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7a2 2 0 0 0 1.5 2" />
        </svg>
      )}
      <span role="status" className={styles.status}>
        {copied ? shortcut.copied : ""}
      </span>
    </button>
  );
}
