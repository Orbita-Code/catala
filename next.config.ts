import type { NextConfig } from "next";
import { resolve } from "path";

/**
 * Bezbednosna zaglavlja (nalaz S5, audit 30.07.2026).
 * Zaglavlje = poruka koju server pošalje pregledaču uz stranu, pre samog sadržaja.
 * Pre ovoga aplikacija nije slala nijedno.
 *
 * Namerno NIJE prestrogo — aplikacija mora da nastavi da radi:
 *  - fontovi se učitavaju sa Google-a (`@import` u globals.css)
 *  - registracija servisnog radnika je ugrađena skripta (`dangerouslySetInnerHTML`)
 *  - zadaci samoprocene koriste MIKROFON (prepoznavanje govora), pa mora ostati dozvoljen
 */
const bezbednosnaZaglavlja = [
  {
    // Odakle pregledač SME da učita kod, slike i stilove. Sve što nije nabrojano — odbija.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' je nužan: Next ubacuje ugrađene skripte, a i registracija
      // servisnog radnika je ugrađena. Bez toga bi aplikacija stala.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob:",
      "media-src 'self' data: blob:",
      // Servisni radnik (skripta koja kešira sajt za rad bez interneta) SAM preuzima
      // fontove, a njegov `fetch` potpada pod `connect-src`. Bez ova dva izvora
      // fontovi tiho padnu sa `ERR_FAILED` — uhvaćeno kapijom 31.07.2026.
      "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
      // Niko ne sme da uglavi našu stranu u svoj okvir (zaštita od klik-podvale)
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
  // Stariji pregledači: isto značenje kao `frame-ancestors 'none'`
  { key: "X-Frame-Options", value: "DENY" },
  // Pregledač ne sme da „pogađa" tip fajla — sprečava da se slika izvrši kao skripta
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Kad se ode na spoljni link, ne šalje se cela adresa naše strane
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Mikrofon OSTAJE dozvoljen (samoprocena govora); kamera i lokacija se gase
  { key: "Permissions-Policy", value: "microphone=(self), camera=(), geolocation=(), payment=()" },
  // Uvek HTTPS, godinu dana
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: resolve(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: bezbednosnaZaglavlja }];
  },
};

export default nextConfig;
