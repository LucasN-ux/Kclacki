import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/domain/locale";

// English is the default language and lives at the root: "/", "/blender".
// The pages are built under "/en" and "/fr", so a root address is served from
// "/en" without the visitor ever seeing it, and "/en/…" sends back to the root
// so that one page never answers at two addresses.
const PREFIXED_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasPrefix = PREFIXED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasPrefix) return;

  if (
    pathname === `/${DEFAULT_LOCALE}` ||
    pathname.startsWith(`/${DEFAULT_LOCALE}/`)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next.js internals and static files.
  matcher: ["/((?!_next|favicon.ico|.*\\.).*)"],
};
