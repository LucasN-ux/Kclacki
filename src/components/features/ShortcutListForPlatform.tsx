"use client";

import { ShortcutList } from "@/components/ui/ShortcutRow";
import type { Locale } from "@/domain/locale";
import type { Shortcut } from "@/domain/schema";
import { usePlatform } from "@/hooks/usePlatform";

// Same list as ShortcutList, but following the Windows / Mac toggle.
export function ShortcutListForPlatform({
  shortcuts,
  locale,
}: {
  shortcuts: Shortcut[];
  locale: Locale;
}) {
  const { platform } = usePlatform();
  return (
    <ShortcutList shortcuts={shortcuts} platform={platform} locale={locale} />
  );
}
