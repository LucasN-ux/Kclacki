import Image from "next/image";
import Link from "next/link";
import ghost from "@/../public/ghost.png";
import { FavoritesLink } from "@/components/features/FavoritesLink";
import { HeaderSearch } from "@/components/features/HeaderSearch";
import { PlatformToggle } from "@/components/features/PlatformToggle";
import { LOCALES, localeHref, type Locale } from "@/domain/locale";
import { SUGGEST_URL } from "@/domain/site";
import { getDictionary } from "@/i18n";
import styles from "./SiteChrome.module.css";

export function SiteHeader({
  locale,
  path = "",
  showSearch = true,
}: {
  locale: Locale;
  path?: string;
  /** The home page has its own big search field, the header one would be a double. */
  showSearch?: boolean;
}) {
  const dictionary = getDictionary(locale);

  return (
    <header className={styles.header}>
      <a className={styles.skip} href="#content">
        {dictionary.nav.skipToContent}
      </a>
      <Link href={localeHref(locale)} className={styles.brand}>
        {/* The ghost is decorative: the name next to it carries the meaning. */}
        <Image src={ghost} alt="" className={styles.brandGhost} priority />
        Klacki
      </Link>
      {showSearch && (
        <div className={styles.search}>
          <HeaderSearch locale={locale} />
        </div>
      )}
      <div className={styles.controls}>
        <PlatformToggle locale={locale} />
        <FavoritesLink locale={locale} />
        <nav className={styles.locales} aria-label={dictionary.nav.language}>
          {LOCALES.map((option) => (
            <Link
              key={option}
              // Same page, other language: the visitor never loses their place.
              href={localeHref(option, path)}
              hrefLang={option}
              aria-current={option === locale ? "true" : undefined}
              className={`${styles.locale} ${option === locale ? styles.localeCurrent : ""}`}
            >
              {option}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);

  return (
    <footer className={styles.footer}>
      <p>{dictionary.footer.trademarks}</p>
      <nav className={styles.footerLinks}>
        <Link href={localeHref(locale, "/about")}>
          {dictionary.footer.links.about}
        </Link>
        <Link href={localeHref(locale, "/sources")}>
          {dictionary.footer.links.sources}
        </Link>
        <Link href={localeHref(locale, "/legal")}>
          {dictionary.footer.links.legal}
        </Link>
        <Link href={localeHref(locale, "/privacy")}>
          {dictionary.footer.links.privacy}
        </Link>
        <a href={SUGGEST_URL} target="_blank" rel="noreferrer">
          {dictionary.footer.suggest}
        </a>
      </nav>
    </footer>
  );
}
