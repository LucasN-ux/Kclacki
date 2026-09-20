"use client";

import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";

const STORAGE_KEY = "cmdx.favorites";
const CHANGE_EVENT = "cmdx:favorites-change";

// A favourite is a software and a shortcut: "blender:frame-selection".
const StoredFavorites = z.array(z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/));

export function favoriteKey(softwareId: string, shortcutId: string): string {
  return `${softwareId}:${shortcutId}`;
}

// Kept as a string so React can compare two snapshots without rebuilding a set.
let snapshot = "[]";
let chosenInThisVisit: string | null = null;

function readRaw(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return chosenInThisVisit ?? "[]";
    // Anything invalid is dropped rather than crashing the page.
    const parsed = StoredFavorites.safeParse(JSON.parse(stored));
    return parsed.success ? JSON.stringify(parsed.data) : "[]";
  } catch {
    return chosenInThisVisit ?? "[]";
  }
}

function getSnapshot(): string {
  const next = readRaw();
  if (next !== snapshot) snapshot = next;
  return snapshot;
}

// The server knows nothing about this browser: it always renders "no favourite".
function getServerSnapshot(): string {
  return "[]";
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function save(keys: string[]) {
  const value = JSON.stringify(keys);
  chosenInThisVisit = value;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Private mode: the list lasts for this visit only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const keys: string[] = JSON.parse(raw);

  const toggle = useCallback(
    (key: string) => {
      const current: string[] = JSON.parse(readRaw());
      save(
        current.includes(key)
          ? current.filter((item) => item !== key)
          : [...current, key],
      );
    },
    // readRaw and save read the browser directly: nothing to depend on.
    [],
  );

  return {
    keys,
    count: keys.length,
    has: (key: string) => keys.includes(key),
    toggle,
  };
}
