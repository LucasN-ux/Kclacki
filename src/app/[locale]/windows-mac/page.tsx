import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlatformShowcase } from "@/components/features/PlatformShowcase";
import shell from "@/components/ui/PageShell.module.css";
import { SiteFooter, SiteHeader } from "@/components/ui/SiteChrome";
import { SOFTWARE_LIST } from "@/data";
import { DEFAULT_LOCALE, LOCALES, isLocale, localeHref } from "@/domain/locale";
import { platformShowcase } from "@/domain/showcase";
import { getDictionary } from "@/i18n";
import styles from "./page.module.css";

const PATH = "/windows-mac";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/windows-mac">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { platforms } = getDictionary(locale);

  return {
    title: `${platforms.title} — Klacki`,
    description: platforms.lede,
    alternates: {
      canonical: localeHref(locale, PATH),
      languages: {
        ...Object.fromEntries(
          LOCALES.map((item) => [item, localeHref(item, PATH)]),
        ),
        "x-default": localeHref(DEFAULT_LOCALE, PATH),
      },
    },
  };
}

export default async function PlatformsPage({
  params,
}: PageProps<"/[locale]/windows-mac">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);
  const { platforms } = dictionary;
  // Real shortcuts from real software: the page shows the difference instead
  // of describing it.
  const rows = platformShowcase(SOFTWARE_LIST, 6);
  // Counted, never typed: how many software of the catalogue skip a platform.
  const singlePlatform = SOFTWARE_LIST.filter(
    (software) => software.platforms.length === 1,
  );

  return (
    <>
      <SiteHeader locale={locale} path={PATH} />
      <main id="content" className={shell.page}>
        <header className={styles.head}>
          <h1 className={styles.title}>{platforms.title}</h1>
          <p className={styles.lede}>{platforms.lede}</p>
        </header>

        <section className={styles.demo}>
          <h2 className={styles.demoTitle}>{platforms.demoTitle}</h2>
          <PlatformShowcase rows={rows} locale={locale} />
        </section>

        <section className={styles.rules}>
          {platforms.rules.map((rule) => (
            <article key={rule.title} className={styles.rule}>
              <h2 className={styles.ruleTitle}>{rule.title}</h2>
              <p className={styles.ruleText}>{rule.text}</p>
            </article>
          ))}
        </section>

        {/* The software concerned by the last rule, named. */}
        {singlePlatform.length > 0 && (
          <p className={styles.singleList}>
            {singlePlatform.map((software, index) => (
              <span key={software.id}>
                {index > 0 && " · "}
                <Link href={localeHref(locale, `/${software.id}`)}>
                  {software.name}
                </Link>{" "}
                <span className={styles.singleTag}>
                  {software.platforms[0] === "win"
                    ? dictionary.software.windowsOnly
                    : dictionary.software.macOnly}
                </span>
              </span>
            ))}
          </p>
        )}

        <section className={styles.memo}>
          <p>{platforms.memo}</p>
          <Link
            className={styles.memoButton}
            href={localeHref(locale, "/software")}
          >
            {platforms.memoCta}
          </Link>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
