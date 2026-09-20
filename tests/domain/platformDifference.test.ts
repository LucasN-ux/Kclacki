import { describe, expect, it } from "vitest";
import { summarizePlatformDifference } from "@/domain/platformDifference";
import type { Shortcut } from "@/domain/schema";

function shortcut(id: string, differs: boolean): Shortcut {
  return {
    id,
    category: "general",
    action: { en: id, fr: id },
    keys: differs
      ? { win: [["Ctrl", "Z"]], mac: [["Cmd", "Z"]] }
      : { win: [["Tab"]], mac: [["Tab"]] },
  };
}

function list(differing: number, same: number): Shortcut[] {
  return [
    ...Array.from({ length: differing }, (_, i) => shortcut(`d${i}`, true)),
    ...Array.from({ length: same }, (_, i) => shortcut(`s${i}`, false)),
  ];
}

describe("summarizePlatformDifference", () => {
  it("flags nothing when every shortcut is the same (Blender)", () => {
    expect(summarizePlatformDifference(list(0, 20))).toEqual({
      total: 20,
      differing: 0,
      flag: null,
    });
  });

  it("flags nothing when every shortcut differs (Premiere Pro)", () => {
    expect(summarizePlatformDifference(list(20, 0))).toEqual({
      total: 20,
      differing: 20,
      flag: null,
    });
  });

  it("flags the few that differ", () => {
    expect(summarizePlatformDifference(list(3, 17)).flag).toBe("differing");
  });

  it("flags the few that are the same", () => {
    expect(summarizePlatformDifference(list(17, 3)).flag).toBe("same");
  });

  it("flags the differing ones when both groups are equal", () => {
    expect(summarizePlatformDifference(list(5, 5)).flag).toBe("differing");
  });
});
