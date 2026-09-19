import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cmdx",
  description:
    "Keyboard shortcuts for creative software (3D, texturing, VFX, video, 2D), all in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
