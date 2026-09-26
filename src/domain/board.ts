import { keysFor, shownPlatform } from "./keys";
import {
  CATEGORIES,
  type Category,
  type Keys,
  type LocalizedText,
  type Platform,
  type Software,
} from "./schema";

// Ids from the browser or from a shared link are untrusted: keep only the
// catalogue's, once each, in catalogue order, so two boards with the same
// software look the same whoever built them.
export function cleanBoardIds(
  ids: readonly string[],
  known: readonly string[],
): string[] {
  const wanted = new Set(ids);
  return known.filter((id) => wanted.has(id));
}

// "?s=maya,blender" -> ["blender", "maya"]. Anything else in the list is
// dropped rather than breaking the page.
export function parseBoardIds(
  raw: string | null,
  known: readonly string[],
): string[] {
  if (!raw) return [];
  return cleanBoardIds(
    raw.split(",").map((part) => part.trim()),
    known,
  );
}

// The query string of a shareable board.
export function boardQuery(ids: readonly string[]): string {
  return `?s=${ids.join(",")}`;
}

// What a key does in another picked software, when it is not the same action.
export type Trap = {
  combo: string[];
  softwareName: string;
  action: LocalizedText;
  /** Set when the other binding only holds in one mode: "Edit mode". */
  context?: LocalizedText;
};

export type BoardCell =
  | { kind: "keys"; keys: Keys; platform: Platform; traps: Trap[] }
  | { kind: "undocumented" }
  | { kind: "missing" };

// One action across the picked software: cells[i] belongs to picked[i].
export type BoardRow = {
  id: string;
  category: Category;
  label: LocalizedText;
  cells: BoardCell[];
};

// Alt and Option are one physical key, and the order keys are written in does
// not change what is pressed: Shift+Ctrl+Z and Ctrl+Shift+Z are one combo.
function comboKey(combo: readonly string[]): string {
  return combo
    .map((key) => (key === "Option" ? "Alt" : key))
    .sort()
    .join("+");
}

// Every other picked software that binds this combo to a different action.
// Their whole list is searched, not only the rows on screen: R is a trap in
// Maya's "scale" because Blender rotates with R, row or no row.
export function findTraps(
  owner: Software,
  actionId: string,
  combo: readonly string[],
  picked: readonly Software[],
  chosen: Platform,
): Trap[] {
  const wanted = comboKey(combo);
  const traps: Trap[] = [];
  for (const other of picked) {
    if (other.id === owner.id) continue;
    const platform = shownPlatform(other.platforms, chosen);
    for (const theirs of other.shortcuts) {
      if (theirs.id === actionId) continue;
      const clash = keysFor(theirs.keys, platform).some(
        (their) => comboKey(their) === wanted,
      );
      if (clash) {
        traps.push({
          combo: [...combo],
          softwareName: other.name,
          action: theirs.action,
          context: theirs.context,
        });
      }
    }
  }
  return traps;
}

// The board: one row per action that at least two picked software have keys
// for. The first picked software holding an action lends its category and its
// wording. Rows follow the site's category order, then order of appearance.
export function boardRows(
  picked: readonly Software[],
  chosen: Platform,
): BoardRow[] {
  const firstSeen = new Map<
    string,
    { category: Category; label: LocalizedText }
  >();
  for (const software of picked) {
    for (const shortcut of software.shortcuts) {
      if (!firstSeen.has(shortcut.id)) {
        firstSeen.set(shortcut.id, {
          category: shortcut.category,
          label: shortcut.action,
        });
      }
    }
  }

  const rows: BoardRow[] = [];
  for (const [id, { category, label }] of firstSeen) {
    const cells = picked.map((software): BoardCell => {
      const shortcut = software.shortcuts.find((one) => one.id === id);
      if (!shortcut) {
        return software.undocumented.includes(id)
          ? { kind: "undocumented" }
          : { kind: "missing" };
      }
      const platform = shownPlatform(software.platforms, chosen);
      // A clash that holds everywhere bites harder than one limited to a
      // mode: those come first, and they are the ones shown before "+N".
      const traps = keysFor(shortcut.keys, platform)
        .flatMap((combo) => findTraps(software, id, combo, picked, chosen))
        .sort(
          (a, b) => Number(Boolean(a.context)) - Number(Boolean(b.context)),
        );
      return { kind: "keys", keys: shortcut.keys, platform, traps };
    });
    if (cells.filter((cell) => cell.kind === "keys").length >= 2) {
      rows.push({ id, category, label, cells });
    }
  }
  // Array.prototype.sort is stable: inside a category, appearance order stays.
  return rows.sort(
    (a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category),
  );
}
