import { keysFor, shownPlatform } from "./keys";
import {
  CATEGORIES,
  type Category,
  type Keys,
  type LocalizedText,
  type Platform,
  type Shortcut,
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

// ---- Cards: one per action, one line per distinct combination -------------

export type SoftwareRef = { id: string; name: string; initials: string };

// What a key does in the software that bind it to another action.
export type Clash = {
  action: LocalizedText;
  context?: LocalizedText;
  software: SoftwareRef[];
};

// One combination and the picked software that use it for this action.
export type KeyLine = {
  combo: string[];
  platform: Platform;
  software: SoftwareRef[];
  clashes: Clash[];
};

export type ActionCard = {
  id: string;
  category: Category;
  label: LocalizedText;
  // Most shared combination first.
  lines: KeyLine[];
  undocumented: SoftwareRef[];
  // Picked, no keys, not declared undocumented: not collected yet.
  missing: SoftwareRef[];
};

function toRef(software: Software): SoftwareRef {
  return {
    id: software.id,
    name: software.name,
    initials: software.initials,
  };
}

// Every shortcut of a software, by combination, built once per software and
// platform. A clash is then one lookup instead of a scan of the whole list,
// which is what keeps the board linear as the catalogue grows.
type ComboIndex = Map<string, Shortcut[]>;
const comboIndexes = new WeakMap<Software, Map<Platform, ComboIndex>>();

function comboIndex(software: Software, platform: Platform): ComboIndex {
  let byPlatform = comboIndexes.get(software);
  if (!byPlatform) {
    byPlatform = new Map();
    comboIndexes.set(software, byPlatform);
  }
  let index = byPlatform.get(platform);
  if (!index) {
    index = new Map();
    for (const shortcut of software.shortcuts) {
      for (const combo of keysFor(shortcut.keys, platform)) {
        const key = comboKey(combo);
        const bound = index.get(key);
        if (bound) bound.push(shortcut);
        else index.set(key, [shortcut]);
      }
    }
    byPlatform.set(platform, index);
  }
  return index;
}

// The other picked software that bind this line's keys to another action,
// grouped by that action. Clashes that hold everywhere come first.
function clashesFor(
  line: KeyLine,
  actionId: string,
  picked: readonly Software[],
  platformOf: Map<string, Platform>,
): Clash[] {
  const onLine = new Set(line.software.map((software) => software.id));
  const wanted = comboKey(line.combo);
  const byAction = new Map<string, Clash>();
  for (const other of picked) {
    if (onLine.has(other.id)) continue;
    const bound = comboIndex(other, platformOf.get(other.id)!).get(wanted);
    for (const theirs of bound ?? []) {
      if (theirs.id === actionId) continue;
      const group = `${theirs.id}|${theirs.context?.en ?? ""}`;
      const clash = byAction.get(group);
      if (!clash) {
        byAction.set(group, {
          action: theirs.action,
          context: theirs.context,
          software: [toRef(other)],
        });
      } else if (!clash.software.some((one) => one.id === other.id)) {
        clash.software.push(toRef(other));
      }
    }
  }
  return [...byAction.values()].sort(
    (a, b) => Number(Boolean(a.context)) - Number(Boolean(b.context)),
  );
}

// One card per action that at least two picked software have keys for. The
// size of a card follows how much the software disagree, not how many there
// are: fourteen software agreeing on Ctrl+Z make a single line.
export function boardCards(
  picked: readonly Software[],
  chosen: Platform,
): ActionCard[] {
  const platformOf = new Map(
    picked.map((software) => [
      software.id,
      shownPlatform(software.platforms, chosen),
    ]),
  );

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

  const cards: ActionCard[] = [];
  for (const [id, { category, label }] of firstSeen) {
    const lines = new Map<string, KeyLine>();
    const undocumented: SoftwareRef[] = [];
    const missing: SoftwareRef[] = [];
    let documented = 0;

    for (const software of picked) {
      const shortcut = software.shortcuts.find((one) => one.id === id);
      if (!shortcut) {
        (software.undocumented.includes(id) ? undocumented : missing).push(
          toRef(software),
        );
        continue;
      }
      documented += 1;
      const platform = platformOf.get(software.id)!;
      for (const combo of keysFor(shortcut.keys, platform)) {
        const key = comboKey(combo);
        const line = lines.get(key);
        if (!line) {
          lines.set(key, {
            combo: [...combo],
            platform,
            software: [toRef(software)],
            clashes: [],
          });
        } else if (!line.software.some((one) => one.id === software.id)) {
          line.software.push(toRef(software));
        }
      }
    }
    if (documented < 2) continue;

    // Stable sort: equal counts keep catalogue order.
    const sorted = [...lines.values()].sort(
      (a, b) => b.software.length - a.software.length,
    );
    for (const line of sorted) {
      line.clashes = clashesFor(line, id, picked, platformOf);
    }
    cards.push({ id, category, label, lines: sorted, undocumented, missing });
  }

  return cards.sort(
    (a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category),
  );
}

// Everyone who documents the action uses the same keys, and nobody else
// uses them for something else: nothing to relearn.
export function isAgreement(card: ActionCard): boolean {
  return card.lines.length === 1 && card.lines[0].clashes.length === 0;
}

export function visibleCards(
  cards: readonly ActionCard[],
  filters: { category: Category | null; onlyDifferences: boolean },
): ActionCard[] {
  return cards.filter(
    (card) =>
      (filters.category === null || card.category === filters.category) &&
      !(filters.onlyDifferences && isAgreement(card)),
  );
}

// "sub" finds both Substance apps, "émber" finds EmberGen.
function fold(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function matchesName(name: string, query: string): boolean {
  return fold(name).includes(fold(query.trim()));
}
