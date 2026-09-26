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
