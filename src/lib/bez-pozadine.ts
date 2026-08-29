/**
 * SKIDANJE BELE POZADINE SA ILUSTRACIJE (28.08.2026).
 *
 * ZAŠTO POSTOJI
 * Sve slike u igri nacrtane su na beloj podlozi. U zadacima to ne smeta — tamo
 * stoje na beloj kartici. Ali na završnoj strani slavlja, gde je nebo tamno,
 * svaki lik dobije beo pravougaonik oko sebe i ceo prizor izgleda kao da su
 * nalepnice zalepljene preko slike. Vlasnica je izričito tražila da NE bude
 * jeftino, „kao da je radio Apple ili Duolingo" — a to znači da lik stoji U
 * prizoru, ne NA njemu.
 *
 * KAKO RADI, I ZAŠTO BAŠ TAKO
 * Ne briše se „sve što je belo" — to bi pojelo doktorov mantil, policajčevu
 * košulju i beonjače. Umesto toga se belo BRIŠE OD IVICE KA UNUTRA: kreće se
 * od ruba slike i ide dalje samo dok nailazi na svetle tačke. Čim naiđe na
 * crtež, staje. Belo koje je zatvoreno unutar lika ostaje netaknuto.
 *
 * Rub se na kraju omekša: tačke koje dodiruju providno, a same su svetle,
 * dobijaju delimičnu providnost. Bez toga bi oko lika ostala tanka bela linija
 * koja se na tamnom nebu jasno vidi.
 *
 * Slike su sa istog sajta, pa platno nije „zatrovano" i sme da se pročita.
 * Ako bilo šta ne uspe, vraća se izvorna slika — nikad prazno.
 */

const kesiraneSlike = new Map<string, string>();

export async function bezBelePozadine(src: string): Promise<string> {
  if (typeof window === "undefined") return src;
  const vecImamo = kesiraneSlike.get(src);
  if (vecImamo) return vecImamo;

  try {
    const slika = await new Promise<HTMLImageElement>((uspeh, greska) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => uspeh(i);
      i.onerror = greska;
      i.src = src;
    });

    const s = slika.naturalWidth;
    const v = slika.naturalHeight;
    if (!s || !v) return src;

    const platno = document.createElement("canvas");
    platno.width = s;
    platno.height = v;
    const ctx = platno.getContext("2d", { willReadFrequently: true });
    if (!ctx) return src;
    ctx.drawImage(slika, 0, 0);

    const podaci = ctx.getImageData(0, 0, s, v);
    const t = podaci.data;

    /** Svetla tačka = pozadina, ali samo ako se do nje stiglo sa ivice. */
    const svetla = (i: number) => t[i] > 228 && t[i + 1] > 228 && t[i + 2] > 228;

    const obidjeno = new Uint8Array(s * v);
    const red: number[] = [];

    for (let x = 0; x < s; x++) {
      red.push(x, (v - 1) * s + x);
    }
    for (let y = 0; y < v; y++) {
      red.push(y * s, y * s + (s - 1));
    }

    while (red.length) {
      const p = red.pop()!;
      if (obidjeno[p]) continue;
      const i = p * 4;
      if (!svetla(i)) continue;
      obidjeno[p] = 1;
      t[i + 3] = 0;
      const x = p % s;
      const y = (p - x) / s;
      if (x > 0) red.push(p - 1);
      if (x < s - 1) red.push(p + 1);
      if (y > 0) red.push(p - s);
      if (y < v - 1) red.push(p + s);
    }

    // Omekšavanje ruba: svetla tačka pored providne postaje poluprovidna.
    for (let y = 1; y < v - 1; y++) {
      for (let x = 1; x < s - 1; x++) {
        const p = y * s + x;
        if (obidjeno[p]) continue;
        const i = p * 4;
        if (t[i + 3] === 0) continue;
        const uzIvicu =
          obidjeno[p - 1] || obidjeno[p + 1] || obidjeno[p - s] || obidjeno[p + s];
        if (!uzIvicu) continue;
        const svetlina = (t[i] + t[i + 1] + t[i + 2]) / 3;
        if (svetlina > 215) t[i + 3] = Math.round(255 * ((255 - svetlina) / 40));
      }
    }

    ctx.putImageData(podaci, 0, 0);
    const izlaz = platno.toDataURL("image/png");
    kesiraneSlike.set(src, izlaz);
    return izlaz;
  } catch {
    return src;
  }
}
