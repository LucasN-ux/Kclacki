import { Ribbon } from "@/components/ui/Ribbon";
import { ShortcutList } from "@/components/ui/ShortcutRow";
import { SoftwareCard } from "@/components/ui/SoftwareCard";
import { SOFTWARE_LIST, getSoftware } from "@/data";
import styles from "./page.module.css";

// Temporary page: it shows the design bricks with real Blender data.
// The real home page arrives on day 4 (Thu 24/09).
export default function Home() {
  const locale = "fr" as const;
  const blender = getSoftware("blender");
  const shortcuts = blender ? blender.shortcuts.slice(0, 8) : [];

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Cmdx</h1>

      <Ribbon>3D &amp; sculpture</Ribbon>

      <div className={styles.grid}>
        {SOFTWARE_LIST.map((software) => (
          <SoftwareCard key={software.id} software={software} locale={locale} />
        ))}
      </div>

      <div className={styles.columns}>
        <section className={styles.column}>
          <Ribbon color="yellow">Windows</Ribbon>
          <ShortcutList shortcuts={shortcuts} platform="win" locale={locale} />
        </section>
        <section className={styles.column}>
          <Ribbon color="orange">Mac</Ribbon>
          <ShortcutList shortcuts={shortcuts} platform="mac" locale={locale} />
        </section>
      </div>
    </main>
  );
}
