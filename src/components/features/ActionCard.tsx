"use client";

import { useState } from "react";
import { KeyCombos } from "@/components/ui/Keycap";
import type { ActionCard as Card, KeyLine, SoftwareRef } from "@/domain/board";
import { comboLabel } from "@/domain/keys";
import type { Locale } from "@/domain/locale";
import type { Keys } from "@/domain/schema";
import { getDictionary } from "@/i18n";
import styles from "./ActionCard.module.css";

// Past eight badges a line folds behind "+N": a hundred software agreeing on
// Ctrl+Z must still read as one line.
const SHOWN_BADGES = 8;
// Past two traps a line folds the rest: with many software nearly every key
// clashes somewhere, and the card must stay short.
const SHOWN_CLASHES = 2;

export function ActionCard({ card, locale }: { card: Card; locale: Locale }) {
  const { board, categories } = getDictionary(locale);
  const headingId = `card-${card.id}`;

  return (
    <article className={styles.card} aria-labelledby={headingId}>
      <p className={styles.category}>{categories[card.category]}</p>
      {/* h2: the cards sit right under the page's h1. */}
      <h2 id={headingId} className={styles.action}>
        {card.label[locale]}
      </h2>
      {card.lines.map((line) => (
        <Line key={line.combo.join("+")} line={line} locale={locale} />
      ))}
      {card.undocumented.length > 0 && (
        <p className={styles.aside}>
          <Badges software={card.undocumented} locale={locale} />
          {board.undocumented}
        </p>
      )}
      {card.missing.length > 0 && (
        <p className={styles.aside}>
          <Badges software={card.missing} locale={locale} />
          {board.missing}
        </p>
      )}
    </article>
  );
}

function Line({ line, locale }: { line: KeyLine; locale: Locale }) {
  const { board } = getDictionary(locale);
  const [unfolded, setUnfolded] = useState(false);
  const folded = unfolded
    ? 0
    : Math.max(line.clashes.length - SHOWN_CLASHES, 0);
  const clashes =
    folded > 0 ? line.clashes.slice(0, SHOWN_CLASHES) : line.clashes;
  const keys: Keys =
    line.platform === "win" ? { win: [line.combo] } : { mac: [line.combo] };

  return (
    <div
      className={`${styles.line} ${line.clashes.length > 0 ? styles.trap : ""}`}
    >
      <KeyCombos keys={keys} platform={line.platform} locale={locale} />
      <div className={styles.body}>
        <Badges software={line.software} locale={locale} />
        {clashes.map((clash) => (
          <p
            key={`${clash.action.en}|${clash.context?.en ?? ""}`}
            className={styles.why}
          >
            <span aria-hidden="true">⚠ </span>
            {comboLabel(line.combo, line.platform, locale)} →{" "}
            {clash.action[locale]}
            {clash.context && ` (${clash.context[locale]})`} {board.in}
            <Badges software={clash.software} locale={locale} />
          </p>
        ))}
        {folded > 0 && (
          <button
            type="button"
            className={styles.moreTraps}
            aria-label={
              folded === 1
                ? board.moreTrapOne
                : `${board.moreTrapsBefore} ${folded} ${board.moreTrapsAfter}`
            }
            onClick={() => setUnfolded(true)}
          >
            +{folded} ⚠
          </button>
        )}
      </div>
    </div>
  );
}

// Initials on a large screen, the full name for screen readers and on a phone.
function Badges({
  software,
  locale,
}: {
  software: SoftwareRef[];
  locale: Locale;
}) {
  const { board } = getDictionary(locale);
  const [unfolded, setUnfolded] = useState(false);
  const folds = !unfolded && software.length > SHOWN_BADGES;
  const shown = folds ? software.slice(0, SHOWN_BADGES) : software;

  return (
    <span className={styles.badges}>
      {shown.map((one) => (
        <span key={one.id} className={styles.badge} title={one.name}>
          <span className={styles.initials} aria-hidden="true">
            {one.initials}
          </span>
          <span className={styles.name}>{one.name}</span>
        </span>
      ))}
      {folds && (
        <button
          type="button"
          className={styles.more}
          aria-label={`${board.showAll} (${software.length - SHOWN_BADGES})`}
          onClick={() => setUnfolded(true)}
        >
          +{software.length - SHOWN_BADGES}
        </button>
      )}
    </span>
  );
}
