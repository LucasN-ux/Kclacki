import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SOFTWARE_LIST } from "@/data";
import { LOCALES, isLocale, DEFAULT_LOCALE } from "@/domain/locale";
import { getDictionary } from "@/i18n";

// The picture shown when the link is pasted in a chat or on a social network.
// It is drawn once per language when the site is built, never on request.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Klacki";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const FONT_DIR = join(process.cwd(), "src/assets/fonts");

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);
  // Same numbers as the site, counted from the same files.
  const shortcutCount = SOFTWARE_LIST.reduce(
    (total, software) => total + software.shortcuts.length,
    0,
  );

  // The promise of the home page, in one piece: the yellow band alone would
  // say "in five seconds" without saying five seconds of what.
  const promise = `${dictionary.home.titleTop} ${dictionary.home.titleMark}`;
  const counts = `${SOFTWARE_LIST.length} ${dictionary.site.softwareCount} · ${shortcutCount} ${dictionary.site.shortcutCount}`;

  const [display, sans, ghost] = await Promise.all([
    readFile(join(FONT_DIR, "Bungee-Regular.ttf")),
    readFile(join(FONT_DIR, "Archivo-Medium.ttf")),
    readFile(join(process.cwd(), "public/ghost.png")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 56,
        padding: "0 72px",
        background: "#f3e7cf",
        // The black line of the flash sheet, all around the picture.
        border: "14px solid #12100d",
      }}
    >
      {/* next/og draws a picture, not a page: next/image has no place here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${ghost.toString("base64")}`}
        width={300}
        height={369}
        alt=""
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "Bungee",
            fontSize: 96,
            color: "#12100d",
            lineHeight: 1.05,
          }}
        >
          Klacki
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            padding: "6px 20px",
            background: "#f4c619",
            border: "5px solid #12100d",
            boxShadow: "8px 8px 0 #12100d",
            fontFamily: "Bungee",
            fontSize: 38,
            lineHeight: 1.2,
            maxWidth: 600,
            color: "#12100d",
          }}
        >
          {promise}
        </div>
        <div
          style={{
            marginTop: 34,
            maxWidth: 620,
            fontFamily: "Archivo",
            fontSize: 27,
            lineHeight: 1.4,
            color: "#4a4038",
          }}
        >
          {dictionary.site.tagline}
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: "Archivo",
            fontSize: 22,
            color: "#12100d",
          }}
        >
          {counts}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Bungee", data: display, style: "normal", weight: 400 },
        { name: "Archivo", data: sans, style: "normal", weight: 500 },
      ],
    },
  );
}
