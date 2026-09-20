import { Software, type Family } from "@/domain/schema";
import blender from "./software/blender.json";
import houdini from "./software/houdini.json";
import maya from "./software/maya.json";
import nuke from "./software/nuke.json";
import premierePro from "./software/premiere-pro.json";
import substanceDesigner from "./software/substance-designer.json";
import substancePainter from "./software/substance-painter.json";
import touchdesigner from "./software/touchdesigner.json";
import zbrush from "./software/zbrush.json";

// Every software file, listed once. Adding a software = adding its JSON file
// and one line here; no other code changes.
const RAW_SOFTWARE: unknown[] = [
  blender,
  houdini,
  maya,
  nuke,
  premierePro,
  substanceDesigner,
  substancePainter,
  touchdesigner,
  zbrush,
];

// Parsed at build time: an invalid file stops the build instead of shipping a
// wrong shortcut. Zod also strips anything the schema does not describe.
export const SOFTWARE_LIST = RAW_SOFTWARE.map((raw) => Software.parse(raw));

const BY_ID = new Map(SOFTWARE_LIST.map((software) => [software.id, software]));

export function getSoftware(id: string) {
  return BY_ID.get(id);
}

export function getSoftwareIds(): string[] {
  return SOFTWARE_LIST.map((software) => software.id);
}

// Families in the order the home page shows them, each with its software.
export const FAMILY_ORDER: Family[] = [
  "3d-sculpt",
  "texture",
  "render-sim-terrain",
  "cloth",
  "compositing-video",
  "2d-realtime",
];

export function softwareByFamily() {
  return FAMILY_ORDER.map((family) => ({
    family,
    software: SOFTWARE_LIST.filter((item) => item.family === family),
  })).filter((group) => group.software.length > 0);
}
