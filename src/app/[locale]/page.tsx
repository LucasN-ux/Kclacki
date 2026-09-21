import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderSearch } from "@/components/features/HeaderSearch";
import { Ribbon } from "@/components/ui/Ribbon";
import { SiteFooter, SiteHeader } from "@/components/ui/SiteChrome";
import { SoftwareCard } from "@/components/ui/SoftwareCard";
import { SOFTWARE_LIST, softwareByFamily } from "@/data";
import { isLocale, localeHref } from "@/domain/locale";
import { getDictionary } from "@/i18n";
import shell from "@/components/ui/PageShell.module.css";
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
      <SiteHeader locale={locale} showSearch={false} />
      <main id="content" className={shell.page}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Klacki</h1>
          <p className={styles.tagline}>{dictionary.site.tagline}</p>
          <div className={styles.heroSearch}>
            <HeaderSearch locale={locale} hero />
          </div>
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
                <Link
                  key={software.id}
                  href={localeHref(locale, `/${software.id}`)}
                >
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
