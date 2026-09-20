import type { Metadata } from "next";
import { PlatformProvider } from "@/hooks/usePlatform";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cmdx",
  description:
    "Keyboard shortcuts for creative software (3D, texturing, VFX, video, 2D), all in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // lang is set per language segment on day 4; French while the pages are built.
    <html lang="fr" className={fontVariables}>
      <body>
        <PlatformProvider>{children}</PlatformProvider>
      </body>
    </html>
  );
}
