import { describe, expect, it } from "vitest";
import { Software } from "@/domain/schema";

// Smallest valid software file; each test breaks one rule on a copy of it.
function validSoftware() {
  return {
    id: "blender",
    name: "Blender",
    initials: "BL",
    family: "3d-sculpt",
    version: "4.5",
    docUrl: "https://docs.blender.org/manual/en/4.5/",
    verifiedAt: "2026-09-22",
    shortcuts: [
      {
        id: "frame-selection",
        category: "navigation",
        action: { en: "Frame selected", fr: "Cadrer la sélection" },
        keys: { win: [["Numpad ."]], mac: [["Numpad ."]] },
      },
    ],
  };
}

function errorsOf(data: unknown): string[] {
  const result = Software.safeParse(data);
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.path.join("."));
}

describe("Software schema", () => {
  it("accepts a valid file", () => {
    expect(errorsOf(validSoftware())).toEqual([]);
  });

  it("accepts an optional context and alternative combos", () => {
    const data = validSoftware();
    data.shortcuts[0] = {
      ...data.shortcuts[0],
      context: { en: "Edit mode", fr: "Mode Édition" },
      keys: { win: [["X"], ["Delete"]], mac: [["X"], ["Delete"]] },
    } as (typeof data.shortcuts)[0];
    expect(errorsOf(data)).toEqual([]);
  });

  it("rejects a missing translation", () => {
    const data = validSoftware();
    data.shortcuts[0].action = { en: "Frame selected", fr: "" };
    expect(errorsOf(data)).toEqual(["shortcuts.0.action.fr"]);
  });

  it("rejects an empty Mac shortcut", () => {
    const data = validSoftware();
    data.shortcuts[0].keys.mac = [];
    expect(errorsOf(data)).toEqual(["shortcuts.0.keys.mac"]);
  });

  it("rejects an unknown category", () => {
    const data = validSoftware();
    data.shortcuts[0].category = "navigtion";
    expect(errorsOf(data)).toEqual(["shortcuts.0.category"]);
  });

  it("rejects Cmd on Windows and Alt on Mac", () => {
    const data = validSoftware();
    data.shortcuts[0].keys = { win: [["Cmd", "Z"]], mac: [["Alt", "Z"]] };
    expect(errorsOf(data)).toEqual([
      "shortcuts.0.keys.win",
      "shortcuts.0.keys.mac",
    ]);
  });

  it("rejects two shortcuts with the same id", () => {
    const data = validSoftware();
    data.shortcuts.push({ ...data.shortcuts[0] });
    expect(errorsOf(data)).toEqual(["shortcuts.1.id"]);
  });

  it("rejects an id that is not kebab-case", () => {
    const data = validSoftware();
    data.shortcuts[0].id = "Frame Selection";
    expect(errorsOf(data)).toEqual(["shortcuts.0.id"]);
  });

  it("rejects a non-https doc link and a bad date", () => {
    const data = validSoftware();
    data.docUrl = "http://docs.blender.org";
    data.verifiedAt = "22/09/2026";
    expect(errorsOf(data)).toEqual(["docUrl", "verifiedAt"]);
  });
});
