import { PlatformToggle } from "@/components/features/PlatformToggle";
import { ShortcutListForPlatform } from "@/components/features/ShortcutListForPlatform";
import { Ribbon } from "@/components/ui/Ribbon";
import { SoftwareCard } from "@/components/ui/SoftwareCard";
import { SOFTWARE_LIST, getSoftware } from "@/data";
import styles from "./page.module.css";

// Temporary page: it shows the design bricks with real Blender data.
// The real home page arrives on day 4 (Thu 24/09).
export default function Home() {
  const locale = "fr" as const;
  // Two opposite cases side by side: Premiere Pro changes every key on Mac,
  // Blender changes none.
  const premiere = getSoftware("premiere-pro");
  const blender = getSoftware("blender");
  const premiereShortcuts = premiere ? premiere.shortcuts.slice(0, 6) : [];
  const blenderShortcuts = blender ? blender.shortcuts.slice(0, 6) : [];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Cmdx</h1>
        <PlatformToggle locale={locale} />
      </header>

      <Ribbon>3D &amp; sculpture</Ribbon>

      <div className={styles.grid}>
        {SOFTWARE_LIST.map((software) => (
          <SoftwareCard key={software.id} software={software} locale={locale} />
        ))}
      </div>

      <div className={styles.columns}>
        <section className={styles.column}>
          <Ribbon color="yellow">Premiere Pro</Ribbon>
          <ShortcutListForPlatform
            shortcuts={premiereShortcuts}
            locale={locale}
          />
        </section>
        <section className={styles.column}>
          <Ribbon color="orange">Blender</Ribbon>
          <ShortcutListForPlatform
            shortcuts={blenderShortcuts}
            locale={locale}
          />
        </section>
      </div>
    </main>
  );
}
