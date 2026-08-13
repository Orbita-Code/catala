"use client";

/**
 * Skupi tehničke podatke o mikrofonu i pošalji ih serveru.
 *
 * Poziva se kad mikrofon zataji. Nikad ne baca grešku i nikad ne čeka odgovor —
 * dijagnostika ne sme da uspori ni da poremeti zadatak.
 */
export async function javiKvarMikrofona(gde: string, greska: string) {
  if (typeof window === "undefined") return;
  try {
    const ua = navigator.userAgent;
    const pregledac = /Edg\//.test(ua) ? "Edge"
      : /OPR\//.test(ua) ? "Opera"
      : /Chrome\//.test(ua) ? "Chrome"
      : /Firefox\//.test(ua) ? "Firefox"
      : /Safari\//.test(ua) ? "Safari"
      : "nepoznat";
    const verzija = (ua.match(/(?:Chrome|Firefox|Version|Edg|OPR)\/(\d+)/) || [])[1] || "?";

    let dozvola = "nepoznato";
    try {
      const p = await navigator.permissions?.query({ name: "microphone" as PermissionName });
      if (p) dozvola = p.state;
    } catch { /* Safari ne ume da odgovori — to je samo po sebi podatak */ }

    let mikrofona = -1;
    try {
      const d = await navigator.mediaDevices?.enumerateDevices();
      if (d) mikrofona = d.filter((x) => x.kind === "audioinput").length;
    } catch { /* isto */ }

    await fetch("/api/dijagnostika", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gde,
        pregledac: `${pregledac} ${verzija}`,
        bezbedno: window.isSecureContext,
        imaPrepoznavanje: !!(
          (window as unknown as Record<string, unknown>).SpeechRecognition ||
          (window as unknown as Record<string, unknown>).webkitSpeechRecognition
        ),
        dozvola,
        mikrofona,
        greska,
      }),
      keepalive: true,
    });
  } catch {
    // Ako i sama prijava padne, ćuti — dete ne sme ništa da primeti.
  }
}
