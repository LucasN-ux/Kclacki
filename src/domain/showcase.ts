import { isSameOnBothPlatforms } from "./keys";
import type { Keys, LocalizedText, Software } from "./schema";

// One line of the Windows / Mac demonstration: a real shortcut, taken from a
// real software, with the version it was checked against.
export type ShowcaseRow = {
  softwareId: string;
  softwareName: string;
  version: string;
  shortcutId: string;
  action: LocalizedText;
  keys: Keys;
  /** True when Windows and Mac press the same keys. */
  same: boolean;
};

function toRow(software: Software, shortcut: Software["shortcuts"][number]) {
  return {
    softwareId: software.id,
    softwareName: software.name,
    version: software.version,
    shortcutId: shortcut.id,
    action: shortcut.action,
    keys: shortcut.keys,
    same: isSameOnBothPlatforms(shortcut.keys),
  };
}

// The rows shown on the Windows / Mac page. They alternate between a shortcut
// that changes and one that does not, never twice the same software, so the
// page proves its point instead of claiming it. Software that runs on one
// platform only is left out: there is nothing to compare.
export function platformShowcase(list: Software[], limit = 4): ShowcaseRow[] {
  const differing: ShowcaseRow[] = [];
  const same: ShowcaseRow[] = [];

  for (const software of list) {
    if (!software.platforms.includes("win")) continue;
    if (!software.platforms.includes("mac")) continue;

    const changes = software.shortcuts.find(
      (shortcut) => !isSameOnBothPlatforms(shortcut.keys),
    );
    const unchanged = software.shortcuts.find((shortcut) =>
      isSameOnBothPlatforms(shortcut.keys),
    );
    if (changes) differing.push(toRow(software, changes));
    if (unchanged) same.push(toRow(software, unchanged));
  }

  const rows: ShowcaseRow[] = [];
  const usedSoftware = new Set<string>();
  const queues = [differing, same];

  // Take from one queue then the other. When a queue runs dry, the other one
  // finishes the list.
  for (let turn = 0; rows.length < limit; turn += 1) {
    const ordered = turn % 2 === 0 ? queues : [queues[1], queues[0]];
    const next = ordered
      .flat()
      .find((row) => !usedSoftware.has(row.softwareId));
    if (!next) break;
    usedSoftware.add(next.softwareId);
    rows.push(next);
  }

  return rows;
}
