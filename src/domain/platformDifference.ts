import { isSameOnBothPlatforms } from "./keys";
import type { Shortcut } from "./schema";

// Which rows deserve a flag. A flag is only useful when it is rare:
// - "differing": most shortcuts are the same, so the ones that change stand out.
// - "same": most shortcuts change (every Adobe app), so the ones that do not stand out.
// - null: every shortcut behaves the same way, one sentence says it once.
export type FlaggedRows = "differing" | "same" | null;

export type PlatformDifference = {
  total: number;
  differing: number;
  /** Which rows carry a flag, if any. */
  flag: FlaggedRows;
};

export function summarizePlatformDifference(
  shortcuts: Shortcut[],
): PlatformDifference {
  const total = shortcuts.length;
  const differing = shortcuts.filter(
    (shortcut) => !isSameOnBothPlatforms(shortcut.keys),
  ).length;

  if (differing === 0 || differing === total) {
    return { total, differing, flag: null };
  }
  // Flag whichever group is smaller; ties flag the differing ones, the more
  // useful warning of the two.
  return {
    total,
    differing,
    flag: differing <= total - differing ? "differing" : "same",
  };
}
