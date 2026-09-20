import Link from "next/link";
import { PlatformToggle } from "@/components/features/PlatformToggle";
import { LOCALES, localeHref, type Locale } from "@/domain/locale";
import { getDictionary } from "@/i18n";
import styles from "./SiteChrome.module.css";

// The shortcuts repository: the free way to let visitors report a wrong key.
const SUGGEST_URL = "https://github.com/LucasN-ux/CMDX/issues/new";

export function SiteHeader({
  locale,
  path = "",
}: {
  locale: Locale;
  path?: string;
}) {
  const dictionary = getDictionary(locale);

  return (
    <header className={styles.header}>
      <Link href={localeHref(locale)} className={styles.brand}>
        Cmdx
      </Link>
      <div className={styles.controls}>
        <PlatformToggle locale={locale} />
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
      <a href={SUGGEST_URL} target="_blank" rel="noreferrer">
        {dictionary.footer.suggest}
      </a>
    </footer>
  );
}
