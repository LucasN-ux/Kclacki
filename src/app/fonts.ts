import { Alfa_Slab_One, Archivo, Space_Mono } from "next/font/google";

// Free fonts (SIL Open Font License). next/font downloads them at build time and
// serves them from our own domain: no request to Google when a visitor opens the site.
export const display = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const sans = Archivo({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
