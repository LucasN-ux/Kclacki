import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShortcutListForPlatform } from "@/components/features/ShortcutListForPlatform";
import { PlatformSummary } from "@/components/ui/ShortcutRow";
import { Ribbon } from "@/components/ui/Ribbon";
import { SiteFooter, SiteHeader } from "@/components/ui/SiteChrome";
import { SOFTWARE_LIST, getSoftware } from "@/data";
import { DEFAULT_LOCALE, LOCALES, isLocale, localeHref } from "@/domain/locale";
import { summarizePlatformDifference } from "@/domain/platformDifference";
import { CATEGORIES } from "@/domain/schema";
import { getDictionary } from "@/i18n";
import styles from "./page.module.css";

// One page per software and per language, all built ahead of time.
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    SOFTWARE_LIST.map((software) => ({ locale, software: software.id })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[software]">): Promise<Metadata> {
  const { locale, software: softwareId } = await params;
  const software = getSoftware(softwareId);
  if (!isLocale(locale) || !software) return {};
  const dictionary = getDictionary(locale);

  return {
    title: `${software.name} — Cmdx`,
    description: `${software.name} ${software.version} · ${software.shortcuts.length} ${dictionary.site.shortcutCount}`,
    alternates: {
      canonical: localeHref(locale, `/${software.id}`),
      languages: {
        ...Object.fromEntries(
          LOCALES.map((item) => [item, localeHref(item, `/${software.id}`)]),
        ),
        "x-default": localeHref(DEFAULT_LOCALE, `/${software.id}`),
      },
    },
  };
}

export default async function SoftwarePage({
  params,
}: PageProps<"/[locale]/[software]">) {
  const { locale, software: softwareId } = await params;
  const software = getSoftware(softwareId);
  if (!isLocale(locale) || !software) notFound();

  const dictionary = getDictionary(locale);
  // Decided once for the whole software, then applied to every list below.
  const { flag } = summarizePlatformDifference(software.shortcuts);
  // Dates read differently in each language: 20 septembre 2026 / September 20, 2026.
  const checkedOn = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(new Date(software.verifiedAt));
  // Categories in a fixed order, and only those this software actually uses.
  const categories = CATEGORIES.map((category) => ({
    category,
    shortcuts: software.shortcuts.filter(
      (shortcut) => shortcut.category === category,
    ),
  })).filter((group) => group.shortcuts.length > 0);

  return (
    <>
      <SiteHeader locale={locale} path={`/${software.id}`} />
      <main className={styles.page}>
        <p className={styles.crumb}>
          <Link href={localeHref(locale)}>{dictionary.software.backHome}</Link>{" "}
          › {software.name}
        </p>

        <div className={styles.titleRow}>
          <span className={styles.badge} aria-hidden="true">
            {software.initials}
          </span>
          <div>
            <h1 className={styles.title}>{software.name}</h1>
            <p className={styles.meta}>
              {software.shortcuts.length} {dictionary.site.shortcutCount} ·{" "}
              {dictionary.software.version} {software.version} ·{" "}
              {dictionary.software.checkedOn} {checkedOn} ·{" "}
              <a href={software.docUrl} target="_blank" rel="noreferrer">
                {dictionary.software.officialDoc}
              </a>
            </p>
            <PlatformSummary shortcuts={software.shortcuts} locale={locale} />
          </div>
        </div>

        <div className={styles.columns}>
          <nav className={styles.nav} aria-label={dictionary.nav.home}>
            {categories.map((group) => (
              <a
                key={group.category}
                href={`#${group.category}`}
                className={styles.navLink}
              >
                {dictionary.categories[group.category]}
                <span className={styles.navCount}>
                  {group.shortcuts.length}
                </span>
              </a>
            ))}
          </nav>

          <div className={styles.categories}>
            {categories.map((group) => (
              <section
                key={group.category}
                id={group.category}
                className={styles.category}
              >
                <h2>
                  <Ribbon color="yellow">
                    {dictionary.categories[group.category]}
                  </Ribbon>
                </h2>
                <ShortcutListForPlatform
                  shortcuts={group.shortcuts}
                  locale={locale}
                  flag={flag}
                />
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
