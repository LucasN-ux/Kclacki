import Link from "next/link";
import { FavoritesLink } from "@/components/features/FavoritesLink";
import { HeaderSearch } from "@/components/features/HeaderSearch";
import { PlatformToggle } from "@/components/features/PlatformToggle";
import { LOCALES, localeHref, type Locale } from "@/domain/locale";
import { SUGGEST_URL } from "@/domain/site";
import { getDictionary } from "@/i18n";
import styles from "./SiteChrome.module.css";

// The header carries the one link people came for. Windows or Mac, the
// sources and the project are read once, so they live in the footer.
const NAV = [{ path: "/software", label: "catalogue" }] as const;

export function SiteHeader({
  locale,
  path = "",
  showSearch = true,
}: {
  locale: Locale;
  /** Path of the current page, without the language. */
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
      <div className={styles.bar}>
        {/* The name alone: the ghost belongs to the home page, not to every header. */}
        <Link href={localeHref(locale)} className={styles.brand}>
          Klacki
        </Link>

        <nav className={styles.nav} aria-label={dictionary.nav.home}>
          {NAV.map((item) => (
            <Link
              key={item.path}
              href={localeHref(locale, item.path)}
              className={styles.navLink}
              aria-current={path === item.path ? "page" : undefined}
            >
              {dictionary.nav[item.label]}
            </Link>
          ))}
        </nav>

        <div className={styles.controls}>
          {showSearch && (
            <div className={styles.search}>
              <HeaderSearch locale={locale} />
            </div>
          )}
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
      </div>
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const { footer, nav } = dictionary;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div>
            <Link href={localeHref(locale)} className={styles.footerBrand}>
              Klacki
            </Link>
            <p className={styles.footerTagline}>{dictionary.site.tagline}</p>
          </div>

          <div>
            <h2 className={styles.footerTitle}>{nav.sections.site}</h2>
            <ul className={styles.footerLinks}>
              <li>
                <Link href={localeHref(locale, "/software")}>
                  {nav.catalogue}
                </Link>
              </li>
              <li>
                <Link href={localeHref(locale, "/search")}>
                  {dictionary.search.title}
                </Link>
              </li>
              <li>
                <Link href={localeHref(locale, "/favorites")}>
                  {dictionary.favorites.title}
                </Link>
              </li>
              <li>
                <Link href={localeHref(locale, "/windows-mac")}>
                  {nav.platforms}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={styles.footerTitle}>{nav.sections.about}</h2>
            <ul className={styles.footerLinks}>
              <li>
                <Link href={localeHref(locale, "/about")}>{nav.about}</Link>
              </li>
              <li>
                <Link href={localeHref(locale, "/sources")}>
                  {footer.links.sources}
                </Link>
              </li>
              <li>
                <Link href={localeHref(locale, "/legal")}>
                  {footer.links.legal}
                </Link>
              </li>
              <li>
                <Link href={localeHref(locale, "/privacy")}>
                  {footer.links.privacy}
                </Link>
              </li>
              <li>
                <a href={SUGGEST_URL} target="_blank" rel="noreferrer">
                  {footer.suggest}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className={styles.legal}>
          <span>{footer.trademarks}</span>
          <span>{footer.publishedBy}</span>
        </p>
      </div>
    </footer>
  );
}
