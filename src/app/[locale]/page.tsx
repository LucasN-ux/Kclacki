import Link from "next/link";
import { notFound } from "next/navigation";
import { Ribbon } from "@/components/ui/Ribbon";
import { SiteFooter, SiteHeader } from "@/components/ui/SiteChrome";
import { SoftwareCard } from "@/components/ui/SoftwareCard";
import { SOFTWARE_LIST, softwareByFamily } from "@/data";
import { isLocale } from "@/domain/locale";
import { getDictionary } from "@/i18n";
import styles from "./page.module.css";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);
  const groups = softwareByFamily();
  // Real numbers, counted from the data files.
  const shortcutCount = SOFTWARE_LIST.reduce(
    (total, software) => total + software.shortcuts.length,
    0,
  );

  return (
    <>
      <SiteHeader locale={locale} />
      <main className={styles.page}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Cmdx</h1>
          <p className={styles.tagline}>{dictionary.site.tagline}</p>
          <p className={styles.counts}>
            {SOFTWARE_LIST.length} {dictionary.site.softwareCount} ·{" "}
            {shortcutCount} {dictionary.site.shortcutCount}
          </p>
        </section>

        {groups.map((group) => (
          <section key={group.family} className={styles.family}>
            <h2>
              <Ribbon>{dictionary.families[group.family]}</Ribbon>
            </h2>
            <div className={styles.grid}>
              {group.software.map((software) => (
                <Link key={software.id} href={`/${locale}/${software.id}`}>
                  <SoftwareCard software={software} locale={locale} />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
