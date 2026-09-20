"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SearchField } from "@/components/ui/SearchField";
import { localeHref, type Locale } from "@/domain/locale";

const MIN_QUERY_LENGTH = 2;

// The search field of the header and of the home page: typing here does
// nothing until the visitor validates, then the search page takes over.
export function HeaderSearch({
  locale,
  hero = false,
}: {
  locale: Locale;
  hero?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);

  // "/" puts the cursor in the field, Escape empties it: the site can be used
  // without touching the mouse.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const typingElsewhere =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement;
      if (event.key === "/" && !typingElsewhere) {
        event.preventDefault();
        input.current?.focus();
      }
      if (event.key === "Escape" && target === input.current) {
        setQuery("");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <SearchField
      locale={locale}
      value={query}
      onChange={setQuery}
      inputRef={input}
      hero={hero}
      showHint
      onSubmit={() => {
        const trimmed = query.trim();
        if (trimmed.length < MIN_QUERY_LENGTH) return;
        router.push(
          `${localeHref(locale, "/search")}?q=${encodeURIComponent(trimmed)}`,
        );
      }}
    />
  );
}
