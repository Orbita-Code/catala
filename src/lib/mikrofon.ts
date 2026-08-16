"use client";

/**
 * IZBOR MIKROFONA — trajno, po uređaju.
 *
 * ZAŠTO POSTOJI (16.08.2026)
 * Na detetovom laptopu mikrofon se „upali zeleno", ali ne čuje ništa. Najčešći
 * uzrok toga nije aplikacija nego to što pregledač uzme POGREŠAN ulazni uređaj:
 * na Mac-u to ume da bude priključen monitor, kamera, virtuelni uređaj neke
 * druge aplikacije ili slušalice koje nisu na glavi. Pregledač tu bira sam i
 * nikad ne kaže šta je izabrao.
 *
 * Zato aplikacija sada nudi izbor i PAMTI ga. Bez ovoga se kvar ne može
 * popraviti iz aplikacije nego samo kopanjem po sistemskim podešavanjima.
 */

const KLJUC = "catala-mikrofon";

export type Mikrofon = { id: string; ime: string };

/** Zapamćeni izbor, ili `null` za „neka pregledač bira". */
export function izabraniMikrofon(): string | null {
  try {
    const v = localStorage.getItem(KLJUC);
    return v && v !== "auto" ? v : null;
  } catch {
    return null; // zabranjen localStorage ne sme da obori mikrofon
  }
}

export function zapamtiMikrofon(id: string | null) {
  try {
    if (id) localStorage.setItem(KLJUC, id);
    else localStorage.removeItem(KLJUC);
  } catch { /* nema gde da se zapamti — radiće, samo se neće pamtiti */ }
}

/**
 * Spisak mikrofona.
 *
 * VAŽNO: pregledač daje IMENA uređaja tek POSLE dozvole. Pre nje su sva imena
 * prazna i spisak je beskoristan. Zato se ovde prvo kratko zatraži dozvola
 * (i odmah ugasi), pa se tek onda čita spisak.
 */
export async function nadjiMikrofone(): Promise<Mikrofon[]> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices) return [];
  try {
    const tok = await navigator.mediaDevices.getUserMedia({ audio: true });
    tok.getTracks().forEach((t) => t.stop());
  } catch { /* bez dozvole spisak ostaje bez imena, ali se ipak pokušava */ }
  try {
    const svi = await navigator.mediaDevices.enumerateDevices();
    return svi
      .filter((d) => d.kind === "audioinput")
      .map((d, i) => ({ id: d.deviceId, ime: d.label || `Micròfon ${i + 1}` }));
  } catch {
    return [];
  }
}

/**
 * Uslovi za `getUserMedia`.
 *
 * `autoGainControl` je namerno UKLJUČEN: dete govori tiho i sa razdaljine, pa
 * pojačanje samo podigne nivo. `noiseSuppression` je ISKLJUČEN — ume da tihi
 * dečji glas protumači kao šum i obriše ga, a to je tačno kvar koji lovimo.
 */
export function usloviZvuka(): MediaStreamConstraints {
  const id = izabraniMikrofon();
  return {
    audio: {
      ...(id ? { deviceId: { exact: id } } : {}),
      echoCancellation: true,
      noiseSuppression: false,
      autoGainControl: true,
    },
  };
}
