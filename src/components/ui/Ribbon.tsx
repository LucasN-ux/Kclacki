import styles from "./Ribbon.module.css";

type RibbonColor = "green" | "yellow" | "orange";

export function Ribbon({
  children,
  color = "yellow",
}: {
  children: React.ReactNode;
  color?: RibbonColor;
}) {
  return (
    <span className={`${styles.ribbon} ${styles[color] ?? ""}`}>
      <svg
        className={`${styles.tail} ${styles.tailLeft}`}
        viewBox="0 0 30 50"
        aria-hidden="true"
      >
        <path d="M28 4 4 11l8 14-8 14 24 7z" />
      </svg>
      <span className={styles.body}>{children}</span>
      <svg
        className={`${styles.tail} ${styles.tailRight}`}
        viewBox="0 0 30 50"
        aria-hidden="true"
      >
        <path d="M2 4 26 11l-8 14 8 14-24 7z" />
      </svg>
    </span>
  );
}
