import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Català - Aprèn jugant!",
  description:
    "Interaktivna radna sveska za učenje katalonskog jezika za decu od 5-8 godina",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#6C5CE7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body className="antialiased">{children}</body>
    </html>
  );
}
