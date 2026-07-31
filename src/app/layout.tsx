import type { Metadata, Viewport } from "next";
import { Nunito, Comic_Neue } from "next/font/google";
import "./globals.css";

/**
 * FONTOVI (nalaz iz razgovora 31.07.2026).
 * Nunito i Comic Neue su pravi, besplatni fontovi sa Google Fonts — nisu krpljeni.
 * ALI su se učitavali preko `@import` u CSS-u, što je najsporiji način: pregledač
 * prvo skine naš CSS, u njemu nađe `@import`, skine Google-ov CSS, pa tek onda font.
 * Tri odlaska na mrežu pre nego što se tekst pravilno iscrta, uz zavisnost od toga
 * da li je Google dostupan.
 *
 * `next/font/google` skida fontove U TRENUTKU BUILDA i servira ih sa NAŠEG servera:
 * bez odlaska na Google, bez skakanja teksta (Next sam računa zamenski font),
 * i bez slanja podataka o detetu Google-u.
 */
const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const comicNeue = Comic_Neue({
  // Comic Neue postoji samo u „latin" podskupu; katalonska slova (à è é í ò ó ú ï ü ç ·)
  // sva stanu u njega, pa ništa ne fali.
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Català - Aprèn jugant!",
  description:
    "Interaktivna radna sveska za učenje katalonskog jezika za decu od 5-8 godina",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#6C5CE7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" className={`${nunito.variable} ${comicNeue.variable}`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
