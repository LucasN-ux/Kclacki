import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/domain/locale";

// Every page lives under its language: "/en/blender", "/fr/blender".
// An address without a language is sent to the default one, so a page never
// answers at two different addresses.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Skip Next.js internals and static files.
  matcher: ["/((?!_next|favicon.ico|.*\\.).*)"],
};
