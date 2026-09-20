import { describe, expect, it } from "vitest";
import { SOFTWARE_LIST, getSoftware, softwareByFamily } from "./index";

describe("data files", () => {
  it("all pass the schema", () => {
    // SOFTWARE_LIST is parsed on import: this test fails if any file is invalid.
    expect(SOFTWARE_LIST.length).toBeGreaterThan(0);
  });

  it("uses a unique id per software", () => {
    const ids = SOFTWARE_LIST.map((software) => software.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("finds Blender and its shortcuts", () => {
    const blender = getSoftware("blender");
    expect(blender?.name).toBe("Blender");
    expect(blender?.shortcuts.length).toBeGreaterThan(30);
  });

  it("groups software by family, keeping the home page order", () => {
    const groups = softwareByFamily();
    expect(groups[0].family).toBe("3d-sculpt");
    expect(groups.every((group) => group.software.length > 0)).toBe(true);
  });
});
