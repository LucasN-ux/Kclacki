import { describe, expect, it } from "vitest";
import { isModifier, isSameOnBothPlatforms, keyLabel } from "./keys";

describe("keyLabel", () => {
  it("shows symbols for Mac modifiers", () => {
    expect(keyLabel("Cmd", "mac", "en")).toBe("⌘");
    expect(keyLabel("Option", "mac", "fr")).toBe("⌥");
    expect(keyLabel("Shift", "mac", "en")).toBe("⇧");
  });

  it("keeps the name on Windows", () => {
    expect(keyLabel("Ctrl", "win", "en")).toBe("Ctrl");
    expect(keyLabel("Shift", "win", "fr")).toBe("Shift");
  });

  it("translates mouse buttons", () => {
    expect(keyLabel("MouseLeft", "win", "en")).toBe("Left click");
    expect(keyLabel("MouseLeft", "mac", "fr")).toBe("Clic gauche");
  });

  it("leaves regular keys untouched", () => {
    expect(keyLabel("F9", "mac", "fr")).toBe("F9");
  });
});

describe("isModifier", () => {
  it("recognises modifiers only", () => {
    expect(isModifier("Ctrl")).toBe(true);
    expect(isModifier("Cmd")).toBe(true);
    expect(isModifier("E")).toBe(false);
  });
});

describe("isSameOnBothPlatforms", () => {
  it("is true when both platforms use the same keys", () => {
    expect(
      isSameOnBothPlatforms({ win: [["Ctrl", "R"]], mac: [["Ctrl", "R"]] }),
    ).toBe(true);
  });

  it("is false when Mac uses Cmd", () => {
    expect(
      isSameOnBothPlatforms({ win: [["Ctrl", "Z"]], mac: [["Cmd", "Z"]] }),
    ).toBe(false);
  });
});
