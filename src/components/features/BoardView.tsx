"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SOFTWARE_LIST, getSoftwareIds } from "@/data";
import {
  boardCards,
  boardQuery,
  parseBoardIds,
  visibleCards,
} from "@/domain/board";
import { localeHref, type Locale } from "@/domain/locale";
import { CATEGORIES, type Category } from "@/domain/schema";
import { useBoard } from "@/hooks/useBoard";
import { usePlatform } from "@/hooks/usePlatform";
import { getDictionary } from "@/i18n";
import { ActionCard } from "./ActionCard";
import { SoftwarePicker } from "./SoftwarePicker";
import styles from "./BoardView.module.css";

const CONFIRM_MS = 2000;

// The picker, the filters and the cards. A shared link shows its own board
// and never touches the visitor's: only "keep" does.
export function BoardView({ locale }: { locale: Locale }) {
  const { board, categories } = getDictionary(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shared = parseBoardIds(searchParams.get("s"), getSoftwareIds());
  // A link only counts as a board when it names two real software: anything
  // less is ignored, so "keep" can never overwrite a board with nothing.
  const isShared = shared.length >= 2;
  const { ids: own, toggle, replace } = useBoard();
  const { platform } = usePlatform();
  const [linkCopied, setLinkCopied] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);

  const ids = isShared ? shared : own;
  const idsKey = ids.join(",");
  // Catalogue order, whatever order the software were picked in.
  const picked = useMemo(() => {
    const wanted = new Set(idsKey.split(","));
    return SOFTWARE_LIST.filter((software) => wanted.has(software.id));
  }, [idsKey]);
  const cards = useMemo(
    () => (picked.length >= 2 ? boardCards(picked, platform) : []),
    [picked, platform],
  );

  // Categories actually present; a chosen one that has gone falls back to all.
  const present = CATEGORIES.filter((one) =>
    cards.some((card) => card.category === one),
  );
  const activeCategory =
    category !== null && present.includes(category) ? category : null;
  const shown = visibleCards(cards, activeCategory);

  // Any change of software settles the filter on what is on screen now: a
  // category that has vanished stays gone instead of coming back unasked.
  function add(id: string) {
    setCategory(activeCategory);
    if (!own.includes(id)) toggle(id);
  }

  function remove(id: string) {
    setCategory(activeCategory);
    if (own.includes(id)) toggle(id);
  }

  async function share() {
    const url = `${window.location.origin}${localeHref(locale, "/board")}${boardQuery(ids)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Refused clipboard: say nothing rather than claim a copy.
      return;
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), CONFIRM_MS);
  }

  function keep() {
    replace(shared);
    router.replace(localeHref(locale, "/board"));
  }

  return (
    <>
      {isShared && (
        <div className={styles.shared}>
          <p>{board.sharedTitle}</p>
          <button type="button" className={styles.button} onClick={keep}>
            {board.keep}
          </button>
        </div>
      )}

      <SoftwarePicker
        locale={locale}
        picked={picked}
        readOnly={isShared}
        onAdd={add}
        onRemove={remove}
      />

      {picked.length < 2 ? (
        <p className={styles.invite}>{board.invite}</p>
      ) : cards.length === 0 ? (
        <p className={styles.invite}>{board.none}</p>
      ) : (
        <>
          <div className={styles.filters}>
            <div
              className={styles.categories}
              role="group"
              aria-label={board.categoryLabel}
            >
              <button
                type="button"
                className={styles.chip}
                aria-pressed={activeCategory === null}
                onClick={() => setCategory(null)}
              >
                {board.all}
              </button>
              {present.map((one) => (
                <button
                  key={one}
                  type="button"
                  className={styles.chip}
                  aria-pressed={activeCategory === one}
                  onClick={() => setCategory(one)}
                >
                  {categories[one]}
                </button>
              ))}
            </div>
            {!isShared && (
              <button type="button" className={styles.button} onClick={share}>
                {linkCopied ? board.linkCopied : board.share}
              </button>
            )}
          </div>

          <p className={styles.count}>
            {shown.length}{" "}
            {shown.length === 1 ? board.shownOne : board.shownMany}
          </p>

          <div className={styles.grid}>
            {shown.map((card) => (
              <ActionCard key={card.id} card={card} locale={locale} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
