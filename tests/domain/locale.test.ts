import { describe, expect, it } from "vitest";
import { isLocale, localeHref } from "@/domain/locale";

describe("localeHref", () => {
  it("keeps English at the root, without a prefix", () => {
    expect(localeHref("en")).toBe("/");
    expect(localeHref("en", "/blender")).toBe("/blender");
  });

  it("puts the other languages under their own prefix", () => {
    expect(localeHref("fr")).toBe("/fr");
    expect(localeHref("fr", "/blender")).toBe("/fr/blender");
  });

  it("accepts a path without its leading slash", () => {
    expect(localeHref("fr", "blender")).toBe("/fr/blender");
  });
});

describe("isLocale", () => {
  it("accepts the two languages of the site only", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });
});
