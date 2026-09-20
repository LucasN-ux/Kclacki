"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { z } from "zod";
import type { Platform } from "@/domain/schema";

const STORAGE_KEY = "cmdx.platform";
const CHANGE_EVENT = "cmdx:platform-change";

// Anything can end up in localStorage (hand edited, corrupted, from an older
// version): it is validated like any other outside data, never trusted.
const StoredPlatform = z.enum(["win", "mac"]);

type PlatformContextValue = {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
};

const PlatformContext = createContext<PlatformContextValue | null>(null);

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "win";
  return /Mac|iPhone|iPad/.test(navigator.userAgent) ? "mac" : "win";
}

// Used when storage is blocked (private mode): the toggle still works,
// it is just forgotten when the tab closes.
let chosenInThisVisit: Platform | null = null;

// Read once per render, in the browser only: the stored choice, or the
// platform the visitor is browsing from.
function getPlatform(): Platform {
  try {
    const stored = StoredPlatform.safeParse(localStorage.getItem(STORAGE_KEY));
    if (stored.success) return stored.data;
  } catch {
    // Private mode or blocked storage: fall back to the values below.
  }
  return chosenInThisVisit ?? detectPlatform();
}

// On the server there is no browser: the HTML is always rendered for Windows,
// so the same page can be cached for everyone, then corrected once in the browser.
function getServerPlatform(): Platform {
  return "win";
}

function subscribe(onChange: () => void): () => void {
  // "storage" fires when another tab changes the choice, the custom event when
  // this tab does.
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const platform = useSyncExternalStore(
    subscribe,
    getPlatform,
    getServerPlatform,
  );

  const setPlatform = useCallback((next: Platform) => {
    chosenInThisVisit = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Nothing to do: the choice simply lasts for this visit.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo(
    () => ({ platform, setPlatform }),
    [platform, setPlatform],
  );

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform(): PlatformContextValue {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used inside <PlatformProvider>");
  }
  return context;
}
