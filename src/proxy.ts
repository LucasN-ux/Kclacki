import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/domain/locale";

// Reads "fr-FR,fr;q=0.9,en;q=0.8" and keeps the first language we support.
// English wins when the visitor asks for anything else.
function preferredLocale(header: string | null) {
  if (!header) return DEFAULT_LOCALE;
  const asked = header
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      return {
        tag: tag.split("-")[0].toLowerCase(),
        quality: Number(quality ?? 1),
      };
    })
    .sort((a, b) => b.quality - a.quality);

  return (
    asked.find((language) => isLocale(language.tag))?.tag ?? DEFAULT_LOCALE
  );
}

// Every page lives under a language: /fr/blender, /en/blender.
// A request without a language is sent to the visitor's own one.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = preferredLocale(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next.js internals and static files.
  matcher: ["/((?!_next|favicon.ico|.*\\.).*)"],
};
