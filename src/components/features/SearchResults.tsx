"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchField } from "@/components/ui/SearchField";
import { ShortcutList } from "@/components/ui/ShortcutRow";
import { SOFTWARE_LIST } from "@/data";
import { localeHref, type Locale } from "@/domain/locale";
import { summarizePlatformDifference } from "@/domain/platformDifference";
import { countHits, searchShortcuts } from "@/domain/search";
import { shownPlatform } from "@/domain/keys";
import { usePlatform } from "@/hooks/usePlatform";
import { getDictionary } from "@/i18n";
import styles from "./SearchResults.module.css";

const MIN_QUERY_LENGTH = 2;

export function SearchResults({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const input = useRef<HTMLInputElement>(null);
  const { platform: chosenPlatform } = usePlatform();
  const { search } = getDictionary(locale);
  const trimmed = query.trim();

  // Everything happens in the browser: the data is already in the page,
  // so there is no request and no waiting between two letters.
  const hits = useMemo(
    () => searchShortcuts(SOFTWARE_LIST, query, locale),
    [query, locale],
  );

  useEffect(() => {
    input.current?.focus();
  }, []);

  // Keep the address in step with the field, so a result can be shared or
  // reloaded, without adding one history entry per typed letter.
  useEffect(() => {
    const base = localeHref(locale, "/search");
    const value = query.trim();
    window.history.replaceState(
      null,
      "",
      value ? `${base}?q=${encodeURIComponent(value)}` : base,
    );
  }, [query, locale]);

  return (
    <>
      <SearchField
        locale={locale}
        value={query}
        onChange={setQuery}
        inputRef={input}
      />

      <p className={styles.count} aria-live="polite">
        {trimmed.length >= MIN_QUERY_LENGTH
          ? `${countHits(hits)} ${search.results}`
          : search.hint}
      </p>

      {trimmed.length >= MIN_QUERY_LENGTH && hits.length === 0 && (
        <p className={styles.empty}>{search.empty}</p>
      )}

      {hits.map((hit) => (
        <section key={hit.software.id} className={styles.group}>
          <Link
            href={localeHref(locale, `/${hit.software.id}`)}
            className={styles.groupHead}
          >
            <span className={styles.badge} aria-hidden="true">
              {hit.software.initials}
            </span>
            {hit.software.name}
            <span className={styles.groupCount}>{hit.shortcuts.length}</span>
          </Link>
          <ShortcutList
            shortcuts={hit.shortcuts}
            softwareId={hit.software.id}
            platform={shownPlatform(hit.software.platforms, chosenPlatform)}
            locale={locale}
            // Decided from the whole software, not from the few results shown.
            flag={summarizePlatformDifference(hit.software.shortcuts).flag}
          />
        </section>
      ))}
    </>
  );
}
