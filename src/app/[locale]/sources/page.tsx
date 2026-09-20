import type { Metadata } from "next";
import { notFound } from "next/navigation";
import shell from "@/components/ui/PageShell.module.css";
import { SiteFooter, SiteHeader } from "@/components/ui/SiteChrome";
import styles from "@/components/ui/TextPage.module.css";
import { SOFTWARE_LIST } from "@/data";
import { LOCALES, isLocale, localeHref } from "@/domain/locale";
import { getDictionary } from "@/i18n";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sources">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${getDictionary(locale).sources.title} — Cmdx`,
    alternates: { canonical: localeHref(locale, "/sources") },
  };
}

export default async function SourcesPage({
  params,
}: PageProps<"/[locale]/sources">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { sources } = getDictionary(locale);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  return (
    <>
      <SiteHeader locale={locale} path="/sources" />
      <main id="content" className={shell.page}>
        <h1 className={styles.title}>{sources.title}</h1>
        <p className={styles.prose}>{sources.intro}</p>

        {/* Built from the data files: this page can never fall out of step. */}
        <ul className={styles.sources}>
          {SOFTWARE_LIST.map((software) => (
            <li key={software.id} className={styles.source}>
              <span className={styles.sourceName}>{software.name}</span>
              <span className={styles.sourceMeta}>
                {sources.version} {software.version} ·{" "}
                {software.shortcuts.length} {sources.shortcuts}
              </span>
              <span className={styles.sourceMeta}>
                {sources.checkedOn} {date.format(new Date(software.verifiedAt))}
              </span>
              <a
                className={styles.sourceMeta}
                href={software.docUrl}
                target="_blank"
                rel="noreferrer"
              >
                {software.docUrl}
              </a>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
