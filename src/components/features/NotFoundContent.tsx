"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import shell from "@/components/ui/PageShell.module.css";
import { SiteFooter, SiteHeader } from "@/components/ui/SiteChrome";
import { DEFAULT_LOCALE, isLocale, localeHref } from "@/domain/locale";
import { getDictionary } from "@/i18n";
import styles from "./NotFoundContent.module.css";

export function NotFoundContent() {
  // "/fr/anything" is still French: the visitor keeps their language even
  // when the page they asked for does not exist.
  const segment = usePathname().split("/")[1];
  const locale = isLocale(segment) ? segment : DEFAULT_LOCALE;
  const { notFound } = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="content" className={shell.page}>
        <section className={styles.block}>
          <p className={styles.code}>404</p>
          <h1 className={styles.title}>{notFound.title}</h1>
          <p className={styles.text}>{notFound.text}</p>
          <p className={styles.actions}>
            <Link
              className={styles.button}
              href={localeHref(locale, "/software")}
            >
              {notFound.catalogueCta}
            </Link>
            <Link className={styles.link} href={localeHref(locale, "/search")}>
              {notFound.searchCta} →
            </Link>
          </p>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
