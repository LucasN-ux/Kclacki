"use client";

import { ShortcutList } from "@/components/ui/ShortcutRow";
import type { Locale } from "@/domain/locale";
import type { FlaggedRows } from "@/domain/platformDifference";
import type { Platform, Shortcut } from "@/domain/schema";
import { shownPlatform } from "@/domain/keys";
import { usePlatform } from "@/hooks/usePlatform";

// Same list as ShortcutList, but following the Windows / Mac toggle.
export function ShortcutListForPlatform({
  shortcuts,
  softwareId,
  platforms,
  locale,
  flag,
}: {
  shortcuts: Shortcut[];
  softwareId: string;
  /** Platforms the software runs on: a Windows-only one ignores the toggle. */
  platforms: Platform[];
  locale: Locale;
  flag: FlaggedRows;
}) {
  const { platform: chosen } = usePlatform();
  const platform = shownPlatform(platforms, chosen);
  return (
    <ShortcutList
      shortcuts={shortcuts}
      softwareId={softwareId}
      platform={platform}
      locale={locale}
      flag={flag}
    />
  );
}
