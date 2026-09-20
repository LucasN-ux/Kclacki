"use client";

import { ShortcutList } from "@/components/ui/ShortcutRow";
import type { Locale } from "@/domain/locale";
import type { FlaggedRows } from "@/domain/platformDifference";
import type { Shortcut } from "@/domain/schema";
import { usePlatform } from "@/hooks/usePlatform";

// Same list as ShortcutList, but following the Windows / Mac toggle.
export function ShortcutListForPlatform({
  shortcuts,
  locale,
  flag,
}: {
  shortcuts: Shortcut[];
  locale: Locale;
  flag: FlaggedRows;
}) {
  const { platform } = usePlatform();
  return (
    <ShortcutList
      shortcuts={shortcuts}
      platform={platform}
      locale={locale}
      flag={flag}
    />
  );
}
