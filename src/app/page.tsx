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
  // Premiere Pro changes keys on Mac (Ctrl becomes Cmd), which shows the
  // "differs on Mac" flag; Blender uses the same keys everywhere.
  const premiere = getSoftware("premiere-pro");
  const shortcuts = premiere ? premiere.shortcuts.slice(0, 10) : [];

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

      <ShortcutListForPlatform shortcuts={shortcuts} locale={locale} />
    </main>
  );
}
