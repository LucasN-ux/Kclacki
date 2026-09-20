import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, isLocale, localeHref } from "@/domain/locale";
import { SITE_URL } from "@/domain/site";
import { getDictionary } from "@/i18n";
import { PlatformProvider } from "@/hooks/usePlatform";
import { fontVariables } from "../fonts";
import "../globals.css";

// Both languages are built ahead of time: /en and /fr are plain files.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dictionary = getDictionary(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: "Cmdx",
    description: dictionary.site.description,
    // Tells search engines the two pages are translations of each other.
    alternates: {
      canonical: localeHref(locale),
      languages: {
        ...Object.fromEntries(LOCALES.map((item) => [item, localeHref(item)])),
        // Shown to visitors whose language we do not have.
        "x-default": localeHref(DEFAULT_LOCALE),
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <PlatformProvider>{children}</PlatformProvider>
      </body>
    </html>
  );
}
