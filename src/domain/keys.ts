import type { Locale } from "./locale";
import { MODIFIERS, MOUSE_BUTTONS, type Keys, type Platform } from "./schema";

const MODIFIER_SET = new Set<string>(MODIFIERS);

// Mac keyboards print symbols on modifier keys.
const MAC_SYMBOLS: Record<string, string> = {
  Cmd: "⌘",
  Option: "⌥",
  Shift: "⇧",
  Ctrl: "⌃",
};

const MOUSE_LABELS: Record<
  (typeof MOUSE_BUTTONS)[number],
  Record<Locale, string>
> = {
  MouseLeft: { en: "Left click", fr: "Clic gauche" },
  MouseMiddle: { en: "Middle click", fr: "Clic molette" },
  MouseRight: { en: "Right click", fr: "Clic droit" },
  MouseWheel: { en: "Scroll wheel", fr: "Molette" },
};

export function isModifier(key: string): boolean {
  return MODIFIER_SET.has(key);
}

export function isMouse(key: string): key is (typeof MOUSE_BUTTONS)[number] {
  return key in MOUSE_LABELS;
}

// Text printed on a keycap. The stored key never changes, only its display.
export function keyLabel(
  key: string,
  platform: Platform,
  locale: Locale,
): string {
  if (isMouse(key)) return MOUSE_LABELS[key][locale];
  if (platform === "mac" && key in MAC_SYMBOLS) return MAC_SYMBOLS[key];
  // "Numpad ." is stored once and reads naturally in both languages.
  if (locale === "fr" && key.startsWith("Numpad")) {
    return key.replace("Numpad", "Pavé num");
  }
  return key;
}

// Alt and Option are the same physical key, named differently on each keyboard:
// a shortcut using it is still "the same" on both platforms.
function sameKeyAcrossPlatforms(key: string): string {
  return key === "Option" ? "Alt" : key;
}

// True when Windows and Mac use the same keys: the page then shows the
// "Same on Windows & Mac" badge instead of a difference the visitor would look for.
export function isSameOnBothPlatforms(keys: Keys): boolean {
  const normalize = (combos: string[][]) =>
    JSON.stringify(combos.map((combo) => combo.map(sameKeyAcrossPlatforms)));
  return normalize(keys.win) === normalize(keys.mac);
}
