"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { KeyCombos } from "@/components/ui/Keycap";
import { SOFTWARE_LIST, getSoftwareIds } from "@/data";
import {
  boardQuery,
  boardRows,
  parseBoardIds,
  type BoardCell,
  type Trap,
} from "@/domain/board";
import { comboLabel } from "@/domain/keys";
import { localeHref, type Locale } from "@/domain/locale";
import type { Platform } from "@/domain/schema";
import { useBoard } from "@/hooks/useBoard";
import { usePlatform } from "@/hooks/usePlatform";
import { getDictionary } from "@/i18n";
import styles from "./BoardView.module.css";

const CONFIRM_MS = 2000;

// The picker, the table and the share / keep controls. A shared link shows
// its own board and never touches the visitor's: only "keep" does.
export function BoardView({ locale }: { locale: Locale }) {
  const { board } = getDictionary(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shared = parseBoardIds(searchParams.get("s"), getSoftwareIds());
  // A link only counts as a board when it names two real software: anything
  // less is ignored, so "keep" can never overwrite a board with nothing.
  const isShared = shared.length >= 2;
  const { ids: own, toggle, replace } = useBoard();
  const { platform } = usePlatform();
  const [linkCopied, setLinkCopied] = useState(false);

  const ids = isShared ? shared : own;
  // Catalogue order, whatever order the boxes were ticked in.
  const picked = SOFTWARE_LIST.filter((software) => ids.includes(software.id));
  const rows = picked.length >= 2 ? boardRows(picked, platform) : [];

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

      <section aria-labelledby="board-pick">
        <h2 id="board-pick" className={styles.step}>
          {board.pick}
        </h2>
        <div className={styles.chips}>
          {SOFTWARE_LIST.map((software) => (
            <button
              key={software.id}
              type="button"
              className={styles.chip}
              aria-pressed={ids.includes(software.id)}
              // A shared board is read as it came; "keep" makes it editable.
              disabled={isShared}
              onClick={() => toggle(software.id)}
            >
              {software.name}
            </button>
          ))}
        </div>
      </section>

      {picked.length < 2 ? (
        <p className={styles.invite}>{board.invite}</p>
      ) : rows.length === 0 ? (
        <p className={styles.invite}>{board.none}</p>
      ) : (
        <>
          <div className={styles.bar}>
            <p className={styles.count}>
              {rows.length} {board.count}
            </p>
            {!isShared && (
              <button type="button" className={styles.button} onClick={share}>
                {linkCopied ? board.linkCopied : board.share}
              </button>
            )}
          </div>

          {/* Many columns scroll inside this frame, never the whole page. */}
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{board.action}</th>
                  {picked.map((software) => (
                    <th key={software.id} scope="col">
                      {software.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row" className={styles.action}>
                      {row.label[locale]}
                    </th>
                    {row.cells.map((cell, index) => (
                      <td
                        key={picked[index].id}
                        // Read by the phone layout, where each cell becomes a
                        // labelled line of a card.
                        data-software={picked[index].name}
                      >
                        <Cell cell={cell} locale={locale} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className={styles.legend}>
            <li>
              <kbd className={styles.legendTrap}>R</kbd> {board.legendTrap}
            </li>
            <li>
              <span className={styles.undocumented}>{board.undocumented}</span>{" "}
              {board.legendUndocumented}
            </li>
            <li>
              <span className={styles.missing}>—</span> {board.legendMissing}
            </li>
          </ul>
        </>
      )}
    </>
  );
}

function Cell({ cell, locale }: { cell: BoardCell; locale: Locale }) {
  const { board } = getDictionary(locale);

  if (cell.kind === "undocumented") {
    return <span className={styles.undocumented}>{board.undocumented}</span>;
  }
  if (cell.kind === "missing") {
    return (
      <>
        <span className={styles.missing} aria-hidden="true">
          —
        </span>
        <span className={styles.visuallyHidden}>{board.missing}</span>
      </>
    );
  }

  if (cell.traps.length === 0) {
    return (
      <KeyCombos keys={cell.keys} platform={cell.platform} locale={locale} />
    );
  }

  // Compact by default: the keys and a count. The explanation opens on a click
  // (native disclosure, no state), so a crowded board stays one line a row.
  return (
    <details className={styles.trap}>
      <summary>
        <KeyCombos keys={cell.keys} platform={cell.platform} locale={locale} />
        <span className={styles.badge} aria-hidden="true">
          ⚠{cell.traps.length}
        </span>
        <span className={styles.visuallyHidden}>
          {cell.traps.length}{" "}
          {cell.traps.length === 1 ? board.trap : board.traps}
        </span>
      </summary>
      {cell.traps.map((trap, index) => (
        <TrapLine
          key={index}
          trap={trap}
          platform={cell.platform}
          locale={locale}
        />
      ))}
    </details>
  );
}

// "⚠ R in Blender: Rotate (Edit mode)". The mode, when there is one, keeps a
// binding limited to one context from reading as a rule for the whole app.
function TrapLine({
  trap,
  platform,
  locale,
}: {
  trap: Trap;
  platform: Platform;
  locale: Locale;
}) {
  const { board } = getDictionary(locale);
  return (
    <span className={styles.why}>
      <span aria-hidden="true">⚠ </span>
      {comboLabel(trap.combo, platform, locale)} {board.in} {trap.softwareName}
      {board.colon} {trap.action[locale]}
      {trap.context && ` (${trap.context[locale]})`}
    </span>
  );
}
